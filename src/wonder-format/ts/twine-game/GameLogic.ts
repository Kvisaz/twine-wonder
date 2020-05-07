import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData} from "./GameEvents";
import {REGEXP, WONDER} from "../Constants";
import {GameConfig} from "./logic/GameConfig";
import {ITwinePassage, ITwineStory} from "../abstract/TwineModels";
import {RunTime} from '../runtime/RunTime';
import {WonderHistory} from './logic/WonderHistory';
import {AppState, IAppState} from './AppState';
import {RUNTIME_STORE, STORE, STORY_STORE} from './Stores';

export class GameLogic {
    private gameConfig = new GameConfig();
    private history: WonderHistory = new WonderHistory();
    private readonly runTime: RunTime;

    private isStart = true;
    private isInitialStateLoaded = false;

    constructor() {
        this.runTime = new RunTime();
        // @ts-ignore
        window.w = this.runTime;
        // @ts-ignore
        window.Wonder = window.w;

        STORE.state = new AppState();

        this.runTime.onStateLoad(state => this.onStateLoad(state));

        EventBus.getInstance()
            .sub(GameEvents.onPassagePrepared, (message, data) => this.onPassagePrepared(data))
            .sub(GameEvents.onLinkClick, (message, id: string) => this.onClick(id))
            .sub(GameEvents.onBackClick, (message) => this.onBackClick())
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
        this.isStart = false;

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

    private prepareToShow(name: string) {
        console.log('prepareToShow', name);

        EventBus.emit(GameEvents.preparePassage, this.getViewPassage(name));
    }

    private onPassagePrepared(passage: ITwinePassage) {
        this.showPassage(passage);
        const appState = STORE.state;
        this.runTime.onPassage(passage, appState);
        console.log('onPassagePrepared', appState);
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
            this.history,
            this.history
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

    private onStateLoad(state: IAppState) {

        console.log('onStateLoad', state);
        if (state == null) return;

        STORE.state = {
            ...STORE.state,
            ...state
        };
        const appState = STORE.state;
        console.log('this.appState', appState);

        if (this.isInitialStateLoaded == false) {
            this.isInitialStateLoaded = true;
        }

        if (this.isStart) return;

        this.startGame(STORY_STORE.story, STORE.state);
    }

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
}
