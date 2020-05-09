import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData, PreloadPageViewData} from "./GameEvents";
import {REGEXP, WONDER} from "../Constants";
import {GameConfig} from "./logic/GameConfig";
import {ITwinePassage, ITwineStory} from "../abstract/TwineModels";
import {UserScriptApi} from '../runtime/UserScriptApi';
import {WonderHistory} from './logic/WonderHistory';
import {AppState, IAppState} from './AppState';
import {RUNTIME_STORE, STORE, STORY_STORE} from './Stores';
import {parseTwineData} from '../parser/TwineParser';
import {StateRepository} from './logic/repository/StateRepository';
import {IRunTimeCommand} from '../abstract/WonderInterfaces';
import {UserScriptCommand} from '../runtime/UserScriptCommands';
import {Collections} from './logic/collections/Collections';
import {AudioPlayer} from './logic/AudioPlayer';

export class GameLogic {
    private readonly gameConfig;
    private readonly history: WonderHistory;
    private readonly collections: Collections;
    private readonly stateRepo: StateRepository;
    private readonly audioPlayer: AudioPlayer;
    private readonly userScriptApi: UserScriptApi;

    private isAutoSave = true;
    private isAutoLoad = true;

    constructor() {
        this.gameConfig = new GameConfig();
        this.history = new WonderHistory();
        this.collections = new Collections();
        this.stateRepo = new StateRepository();
        this.audioPlayer = new AudioPlayer();
        this.userScriptApi = new UserScriptApi();

        // @ts-ignore
        window.w = this.userScriptApi;
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
        this.execUserScriptCommands();

        this.collections.onStoryReady();

        // предварительная загрузка в любом случае
        then(() => this.preloadState());
    }

    private preloadState() {
        console.log('preloadState...');
        this.stateRepo.load(
            state => this.onPreloadState(state),
            message => console.warn('preloadState error')
        )
    }

    private onPreloadState(state: IAppState) {
        if (state != null) {
            RUNTIME_STORE.hasSave = true;
        }
        if (this.isAutoLoad) {
            this.updateState(state);
        }
        this.startGame(STORY_STORE.story, STORE.state);
    }

    private updateState(state: IAppState) {
        if (state == null) return;
        STORE.state = {
            ...STORE.state,
            ...state
        }
        this.collections.onStateUpdate();
    }


    private onStateLoad(state: IAppState) {
        console.log('onStateLoad...', state);
        this.updateState(state);
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


    private onPassagePrepared(passage: ITwinePassage) {
        this.showPassage(passage);
        const appState = STORE.state;
        this.collections.onPassage(passage);
        this.audioPlayer.musicCheck(passage.name);
    }

    private showPassage(passage: ITwinePassage) {
        EventBus.emit(GameEvents.showPassage, passage);
    }

    private onClick(name: string) {
        console.log('onClick', name);
        this.history.add(name); // текущий узел идёт в историю
        if (this.isAutoSave) this.saveState();

        // добавление в историю нужно до execPassage
        // чтобы в загрузку не добавлялись загрузочные страницы

        const viewData = this.execPassage(name);
        this.startPage(viewData);
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
    private execPassage(name: string): PageViewData {
        const viewPassage = {
            ...STORY_STORE.story.passageHash[name]
        };

        this.execScripts(viewPassage);
        this.execUserScriptCommands();

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
        console.log(`${viewPassage.name} execScripts........`);

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
     *  userScriptApi commands
     *********************/
    private execUserScriptCommands() {
        console.log('execUserScriptCommands...');
        const commands = RUNTIME_STORE.commands;
        while (commands.length > 0) {
            this.execSingleUserCommand(commands.shift())
        }
    }

    private execSingleUserCommand(command: IRunTimeCommand) {
        console.log('...command', command.name, command.data);
        switch (command.name) {
            case UserScriptCommand.enableExternalApi:
                this.stateRepo.enableExternalApi(command.data)
                break;
            case UserScriptCommand.saveSlot:
                this.saveName(command.data);
                break;
            case UserScriptCommand.autoSave:
                this.isAutoSave = command.data === true;
                break;
            case UserScriptCommand.autoLoad:
                this.isAutoLoad = command.data === true;
                break;
            case UserScriptCommand.save:
                if (this.isStatePreload()) return;
                else this.saveState();
                break;
            case UserScriptCommand.load:
                if (this.isStatePreload()) return;
                else then(() => this.loadState());
                break;
            case UserScriptCommand.collectionRule:
                this.collections.addRule(command.data)
                break;
            case UserScriptCommand.music:
                this.audioPlayer.music(
                    command.data.url,
                    command.data.volume);
                break;
            case UserScriptCommand.musicFor:
                this.audioPlayer.musicFor(
                    command.data.hashName,
                    command.data.url,
                    command.data.volume);
                break;
            case UserScriptCommand.sound:
                this.audioPlayer.sound(
                    command.data.url,
                    command.data.volume);
                break;
            case UserScriptCommand.musicStop:
                this.audioPlayer.stop();
                break;
            default:
                console.warn('unhandled userScriptApi command:: ', command.name, command.data);
        }
    }

    isStatePreload(): boolean {
        return STORE.state == null
            || STORE.state.history == null
            || STORE.state.history.pages == null
            || STORE.state.history.pages.length == 0;
    }

    /**************************
     *  save/load functions
     *********************/
    private saveName(saveName: string) {
        this.stateRepo.saveName(saveName,
            messageHandler,
            messageHandler
        )
    }

    private saveState() {
        this.stateRepo.save(STORE.state,
            messageHandler,
            messageHandler
        )
    }

    private loadState() {
        this.stateRepo.load(
            state => this.onStateLoad(state),
            messageHandler
        )
    }

    /**************************
     *  ..
     *********************/

}

// используется для уменьшения нагрузки
function then(fn: Function) {
    setTimeout(fn, 0);
}

function messageHandler(message: string) {
    console.log(message)
}
