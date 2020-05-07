import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData, PreloadPageViewData} from "./GameEvents";
import {REGEXP, WONDER} from "../Constants";
import {GameConfig} from "./logic/GameConfig";
import {ITwinePassage, ITwineStory} from "../abstract/TwineModels";
import {RunTime} from '../runtime/RunTime';
import {WonderHistory} from './logic/WonderHistory';
import {AppState, IAppState} from './AppState';
import {RUNTIME_STORE, STORE, STORY_STORE} from './Stores';
import {parseTwineData} from '../parser/TwineParser';
import {StateRepository} from './repository/StateRepository';
import {IRunTimeCommand} from '../abstract/WonderInterfaces';
import {RunTimeCommand} from '../runtime/RunTimeCommands';

export class GameLogic {
    private gameConfig = new GameConfig();
    private history: WonderHistory = new WonderHistory();
    private readonly runTime: RunTime;

    private stateRepo: StateRepository;
    private isAutoSave = true;

    constructor() {
        this.stateRepo = new StateRepository();
        this.runTime = new RunTime();
        // @ts-ignore
        window.w = this.runTime;
        // @ts-ignore
        window.Wonder = window.w;

        STORE.state = new AppState();
        STORY_STORE.story = null;

        EventBus.getInstance()
            .sub(GameEvents.onPassagePrepared, (message, data) => this.onPassagePrepared(data))
            .sub(GameEvents.onLinkClick, (message, id: string) => this.onClick(id))
            .sub(GameEvents.onBackClick, (message) => this.onBackClick())
    }

    preload() {
        console.log('preloading...');
        const preloadViewData = new PreloadPageViewData();
        this.startPage(preloadViewData);
        then(() => this.startParsing());
    }

    private startParsing() {
        console.log('startParsing...');
        const story = parseTwineData();
        then(() => this.onStoryLoad(story));
    }

    private onStoryLoad(story: ITwineStory) {
        console.log('onStoryLoad...', story);
        STORY_STORE.story = story;

        this.exeScript(story.script, STORE.state.gameVars);
        this.execRunTimeCommands();

        then(() => this.startStateLoading());
    }


    private startStateLoading() {
        console.log('startStateLoading...');

        this.stateRepo.load(
            state => this.onStateLoad(state),
            messageHandler
        )
    }

    private onStateLoad(state: IAppState) {
        console.log('onStateLoad...', state);
        if (state != null) {
            STORE.state = {
                ...STORE.state,
                ...state
            }
        }

        const appState = STORE.state;
        console.log('this.appState', appState);

        this.runTime.onStoryReady();
        this.startGame(STORY_STORE.story, STORE.state);
    }

    // когда загружена и история, и state
    private onStateAndStoryLoad() {
        const isStoryLoaded = STORY_STORE.story != null;
        const isStateLoaded = STORE.state != null;
    }

    // не нужен ли тут прелоадер? )
    loadStory(story: ITwineStory) {
        STORY_STORE.story = story;

        this.exeScript(story.script, STORE.state.gameVars);

        console.log('story.script', STORE.state.gameVars);
        console.log('loadStory, script executed...');

        console.log('loadStory 2, game parsed...');
        EventBus.emit(GameEvents.onStoryLoaded, story);

        this.runTime.onStoryReady();

        this.startGame(STORY_STORE.story, STORE.state);
    }

    /*********
     * LOGIC
     *********/
    private getStartPage(story: ITwineStory, state: IAppState): string {
        const hPages = state.history.pages;
        const lastPage = hPages[hPages.length - 1];
        return lastPage || story.startPassageName;
    }

    private startGame(story: ITwineStory, state: IAppState) {
        this.onClick(this.getStartPage(story, state));
    }

    private startPage(pageViewData: PageViewData) {
        EventBus.emit(GameEvents.preparePassage, pageViewData);
    }

    private prepareToShow(name: string) {
        console.log('prepareToShow', name);
        this.startPage(this.getViewPassage(name));
    }

    private onPassagePrepared(passage: ITwinePassage) {
        this.showPassage(passage);
        const appState = STORE.state;
        this.runTime.onPassage(passage, appState);
    }

    private showPassage(passage: ITwinePassage) {
        EventBus.emit(GameEvents.showPassage, passage);
    }

    private onClick(name: string) {
        console.log('onClick', name);
        this.prepareToShow(name);
        this.history.add(name); // текущий узел идёт в историю
    }


    private onBackClick() {
        this.history.pop(); // текущий узел уходит из истории
        const name = this.history.getLast();
        this.onClick(name);
    }

    /*********
     * helpers
     *********/

    // выполнить скрипт, забинденный на game
    private exeScript(script: string, context: object) {
        let result = null;

        try {
            const func = new Function(script).bind(context); // создаю функцию из строки
            result = func(); // исполняю функцию
        } catch (e) {
            // todo сделать вывод без консоли, оповещение
            // м.б. запись в историю ошибок
            // потому что сейчас весь консольный лог в продакшене чистится
            console.warn(' Wonder - UserScript error:' + e)
        }

        return result;
    }

    /**
     * Формирует viewPassage для отображения
     * + исполняет логику
     * @param name
     */
    private getViewPassage(name: string): PageViewData {
        const viewPassage = {
            ...STORY_STORE.story.passageHash[name]
        };

        console.log('getViewPassage', name, viewPassage);

        this.execScripts(viewPassage);

        return new PageViewData(
            viewPassage,
            STORE.state.gameVars,
            this.gameConfig,
            this.history.canGoBack(viewPassage.name),
            STORE.state.history.pagesHash,
            STORY_STORE.story.passageHash
        );
    }

    /**
     * Исполнить скрипты и вывести их результат, если нужно
     * @param viewPassage
     */
    private execScripts(viewPassage: ITwinePassage) {
        console.log(`execScripts........`);
        console.log(`viewPassage.content`, viewPassage.content);

        const context = STORE.state.gameVars;

        this.clearRunTimeTextBuffer(); // очищаем буффер рантаймовых текстов

        // ищем строки, которые должны исполняться
        viewPassage.content = viewPassage.content
            .replace(REGEXP.exeScript,
                (match, catched) => {
                    let command = catched.trim();
                    const isInline = command[0] == WONDER.inlineStart;
                    if (isInline) command = "return " + command.substring(1);
                    const result = this.exeScript(command, context);

                    const textBuffer: string = this.getRunTimeTextsFromBuffer();
                    const render = isInline ? result : textBuffer;
                    return render;
                });
        console.log(`....... /execScripts`);
    }

    /********************
     *  STATE MANAGEMENT
     *******************/


    /********
     *  inline texts
     *********/
    private getRunTimeTextsFromBuffer() {
        const textBuffer = RUNTIME_STORE.textBuffer;
        let texts = '';
        while (textBuffer.length > 0) {
            texts += textBuffer.shift();
        }
        return texts;
    }

    private clearRunTimeTextBuffer() {
        RUNTIME_STORE.textBuffer = [];
    }

    /**************************
     *  runTime commands
     *********************/
    private execRunTimeCommands() {
        console.log('execRunTimeCommands...');
        const commands = RUNTIME_STORE.commands;
        while (commands.length > 0) {
            this.execSingleRuntimeCommand(commands.shift())
        }
    }

    private execSingleRuntimeCommand(command: IRunTimeCommand) {
        console.log('...command', command.name, command.data);
        switch (command.name) {
            case RunTimeCommand.enableExternalApi:
                this.stateRepo.enableExternalApi(command.data)
                break;
            case RunTimeCommand.saveSlot:
                this.stateRepo.saveName(command.data,
                    messageHandler,
                    messageHandler
                )
                break;
            case RunTimeCommand.autoSave:
                this.isAutoSave = command.data === true;
                break;
            case RunTimeCommand.save:
                if (this.isStatePreload()) return;
                else {
                    this.stateRepo.save(STORE.state,
                        messageHandler,
                        messageHandler
                    )
                }
                break;

            case RunTimeCommand.load:
                if (this.isStatePreload()) return;
                else {
                    this.stateRepo.load(
                        state => this.onStateLoad(state),
                        messageHandler
                    )
                }
                break;
        }
    }

    isStatePreload(): boolean {
        return STORE.state == null
            || STORE.state.history == null
            || STORE.state.history.pages == null
            || STORE.state.history.pages.length == 0;
    }
}

// используется для уменьшения нагрузки
function then(fn: Function) {
    setTimeout(fn, 0);
}

function messageHandler(message: string) {
    console.log(setTimeout)
}
