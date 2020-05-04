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
import {AppEvents} from './AppEvents';
import {IRunTimeState} from '../runtime/IRunTimeState';
import {STORY_STORE} from './StoryStore';

export class GameLogic {
    private gameConfig = new GameConfig();
    private appState: IAppState;

    private history: IWonderHistory = new WonderHistory();

    private readonly runTime: RunTime;

    constructor() {
        this.runTime = new RunTime();
        // @ts-ignore
        window.w = this.runTime;
        // @ts-ignore
        window.Wonder = window.w;

        this.appState = {
            passage: null
        }

        EventBus.getInstance()
            .sub(GameEvents.onPassagePrepared, (message, data) => this.onPassagePrepared(data))
            .sub(GameEvents.onLinkClick, (message, id: string) => this.onClick(id))
            .sub(GameEvents.onBackClick, (message) => this.onBackClick())
    }

    // не нужен ли тут прелоадер? )
    loadStory(story: ITwineStory) {
        STORY_STORE.story = story;

        const gameVars = this.runTime.getGameVars();
        // user script - enable/disable parent API
        this.exeScript(story.script, gameVars);
        console.log('story.script', gameVars);

        console.log('loadStory, script executed...');

        WonderStoryParser.parse(story, gameVars, this.gameConfig);
        this.runTime.setGameVars(gameVars);



        console.log('loadStory 2, game parsed...');
        EventBus.emit(GameEvents.onStoryLoaded, story);

        this.appState.passage = STORY_STORE.story.startPassageName;
        this.prepareToShow(this.appState.passage);

        this.runTime.onStoryReady();
        // enable parent API script
        this.runTime.parentApi().on(AppEvents.load, (state) => this.loadState(state));
    }

    /*********
     * LOGIC
     *********/
    private prepareToShow(name: string) {
        EventBus.emit(GameEvents.preparePassage, this.getViewPassage(name));
    }

    private onPassagePrepared(passage: ITwinePassage) {
        this.showPassage(passage);
        this.runTime.onPassage(passage, this.appState);
        console.log('onPassagePrepared', this.appState);
    }

    private showPassage(passage: ITwinePassage) {
        EventBus.emit(GameEvents.showPassage, passage);
    }

    private onClick(name: string) {
        console.log('onClick', name);
        this.appState.passage = name;
        this.history.add(this.appState.passage); // текущий узел идёт в историю
        this.saveAppState();
        this.prepareToShow(this.appState.passage);
    }

    private onBackClick() {
        console.log('onBackClick');
        this.history.pop();
        this.appState.passage = this.history.getLast();
        this.saveAppState();
        this.prepareToShow( this.appState.passage);
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

    private saveAppState() {
        this.appState.history = this.history.getState();
        this.appState.runTime = this.runTime.getState();

        this.runTime.parentApi().send(AppEvents.passage, this.appState);
    }

    private loadState(state: IAppState) {

        console.log('loadState', state);
        console.log('this.appState', this.appState);

        this.appState = {
            ...this.appState,
            ...state
        };
        console.log('this.appState', this.appState);

        this.history.setState(this.appState.history);
        this.runTime.setState(this.appState.runTime as IRunTimeState);

        this.prepareToShow(this.appState.passage);

    }
}
