import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData} from "./GameEvents";
import {REGEXP, WONDER} from "../Constants";
import {GameConfig} from "./logic/GameConfig";
import {WonderStoryParser} from "./logic/WonderStoryParser";
import {ITwinePassage, ITwineStory} from "../abstract/TwineModels";
import {RunTime} from '../runtime/RunTime';
import {IWonderHistory} from '../abstract/WonderInterfaces';
import {WonderHistory} from './logic/WonderHistory';

export class GameLogic {
    private story: ITwineStory;

    private gameConfig = new GameConfig();
    private appState = {
        gameState: {} // пользовательский контекст
    };

    private history: IWonderHistory = new WonderHistory();

    private runTime: RunTime;

    constructor() {
        this.runTime = new RunTime();
        // @ts-ignore
        window.w = this.runTime;
        // @ts-ignore
        window.Wonder = window.w;

        EventBus.getInstance()
            .sub(GameEvents.onPassagePrepared, (message, data) => this.onPassagePrepared(data))
            .sub(GameEvents.onLinkClick, (message, id: string) => this.onLinkClick(id))
            .sub(GameEvents.onBackClick, (message) => this.onBackClick())
    }

    // не нужен ли тут прелоадер? )
    loadStory(story: ITwineStory) {
        this.story = story;

        this.exeScript(story.script);

        console.log('loadStory, script executed...');
        WonderStoryParser.parse(story, this.appState.gameState, this.gameConfig);
        console.log('loadStory 2, gameState parsed...');
        EventBus.emit(GameEvents.onStoryLoaded, story);
        this.onLinkClick(this.story.startPassageName);

        this.runTime.onStoryReady(story);
    }

    /*********
     * LOGIC
     *********/
    private onPassagePrepared(passage: ITwinePassage) {
        this.showPassage(passage);
        this.runTime.onPassage(passage);
    }

    private showPassage(passage: ITwinePassage) {

        EventBus.emit(GameEvents.showPassage, passage);
    }


    private onLinkClick(name: string) {
        console.log('onLinkClick', name);
        this.history.add(name);
        EventBus.emit(GameEvents.preparePassage, this.getViewPassage(name));
    }


    private onBackClick() {
        console.log('onBackClick');
        this.history.pop();
        const name = this.history.getLast();
        EventBus.emit(GameEvents.preparePassage, this.getViewPassage(name));
    }

    /*********
     * helpers
     *********/

    // выполнить скрипт, забинденный на gameState
    private exeScript(script: string) {
        let result = null;

        try {
            const func = new Function(script).bind(this.appState.gameState); // создаю функцию из строки
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
            ...this.story.passageHash[name]
        };

        console.log('getViewPassage', name, viewPassage);

        this.execScripts(viewPassage);

        return new PageViewData(
            viewPassage,
            this.appState.gameState,
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

        // ищем строки, которые должны исполняться
        viewPassage.content = viewPassage.content
            .replace(REGEXP.exeScript,
                (match, catched) => {
                    let command = catched.trim();
                    const isInline = command[0] == WONDER.inlineStart;
                    if (isInline) command = "return " + command.substring(1);
                    const result = this.exeScript(command);
                    const render = isInline ? result : "";
                    return render;
                });
        console.log(`....... /execScripts`);
    }

}
