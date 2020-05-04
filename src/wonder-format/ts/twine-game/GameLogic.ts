import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData} from "./GameEvents";
import {REGEXP, WONDER} from "../Constants";
import {GameConfig} from "./logic/GameConfig";
import {WonderStoryParser} from "./logic/WonderStoryParser";
import {ITwinePassage, ITwineStory} from "../abstract/TwineModels";
import {RunTime} from '../runtime/RunTime';
import {IWonderHistory} from '../abstract/WonderInterfaces';
import {WonderHistory} from './logic/WonderHistory';
import {IAppState} from './AppState';
import {STORE, STORY_STORE} from './Stores';
import {IRunTimeState} from '../runtime/IRunTimeState';

export class GameLogic {
    private gameConfig = new GameConfig();
    private history: IWonderHistory = new WonderHistory();
    private readonly runTime: RunTime;

    private isStart = true;
    private isInitialStateLoaded = false;

    constructor() {
        this.runTime = new RunTime();
        // @ts-ignore
        window.w = this.runTime;
        // @ts-ignore
        window.Wonder = window.w;

        STORE.state = {
            passage: null
        }

        this.runTime.onStateLoad(state => this.onStateLoad(state));

        EventBus.getInstance()
            .sub(GameEvents.onPassagePrepared, (message, data) => this.onPassagePrepared(data))
            .sub(GameEvents.onLinkClick, (message, id: string) => this.onClick(id))
            .sub(GameEvents.onBackClick, (message) => this.onBackClick())
    }

    // не нужен ли тут прелоадер? )
    loadStory(story: ITwineStory) {
        STORY_STORE.story = story;

        const gameVars = {};
        this.exeScript(story.script, gameVars);

        console.log('story.script', gameVars);

        console.log('loadStory, script executed...');

        WonderStoryParser.parse(story, gameVars, this.gameConfig);

        // подключаем начальные переменные, только если не было загрузки
        if (this.isInitialStateLoaded == false) {
            this.runTime.setGameVars(gameVars);
        }

        console.log('loadStory 2, game parsed...');
        EventBus.emit(GameEvents.onStoryLoaded, story);

        const startPassage = STORE.state.passage || story.startPassageName;
        this.onClick(startPassage);

        this.runTime.onStoryReady();
        this.isStart = false;
    }

    /*********
     * LOGIC
     *********/
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
        const appState = STORE.state;
        this.history.add(appState.passage); // текущий узел идёт в историю
        appState.passage = name;

        this.updateState();
        this.prepareToShow(name);
    }


    private onBackClick() {
        const appState = STORE.state;
        appState.passage = this.history.pop(); // текущий узел уходит из истории
        console.log('onBackClick, pop passage ', appState.passage);

        this.updateState();
        this.prepareToShow(appState.passage);
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
            this.runTime.getGameVars(),
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

        const context = this.runTime.getGameVars();

        // ищем строки, которые должны исполняться
        viewPassage.content = viewPassage.content
            .replace(REGEXP.exeScript,
                (match, catched) => {
                    let command = catched.trim();
                    const isInline = command[0] == WONDER.inlineStart;
                    if (isInline) command = "return " + command.substring(1);
                    const result = this.exeScript(command, context);
                    const render = isInline ? result : "";
                    return render;
                });
        console.log(`....... /execScripts`);
    }

    /********************
     *  STATE MANAGEMENT
     *******************/

    private updateState() {
        const appState = STORE.state;
        appState.history = this.history.getState();
        appState.runTime = this.runTime.getState();
        return appState;
    }

    private onStateLoad(state: IAppState) {

        console.log('onStateLoad', state);
        if (state == null) return;

        STORE.state = {
            ...STORE.state,
            ...state
        };
        const appState = STORE.state;
        console.log('this.appState', appState);

        this.history.setState(appState.history);
        this.runTime.setState(appState.runTime as IRunTimeState);

        if (this.isInitialStateLoaded == false) {
            this.isInitialStateLoaded = true;
        }

        if (this.isStart) return;

        this.prepareToShow(appState.passage);
    }
}
