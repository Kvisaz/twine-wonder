import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData} from "./GameEvents";
import {REGEXP, WONDER} from "../Constants";
import {GameConfig} from "./logic/GameConfig";
import {WonderStoryParser} from "./logic/WonderStoryParser";
import {ITwinePassage, ITwineStory} from "../parser/models/TwineModels";

export class GameLogic {
    private story: ITwineStory;

    private gameConfig = new GameConfig();
    private gameState = {};

    constructor() {
        EventBus.getInstance()
            .sub(GameEvents.onPassagePrepared, (message, data) => this.onPassagePrepared(data))
            .sub(GameEvents.onLinkClick, (message, id: string) => this.onLinkClick(id))
    }

    loadStory(story: ITwineStory) {
        this.story = story;

        this.exeScript(story.script);

        console.log('loadStory 1');
        WonderStoryParser.parse(story, this.gameState, this.gameConfig);
        console.log('loadStory 2');
        EventBus.emit(GameEvents.onStoryLoaded, story);
        EventBus.emit(GameEvents.preparePassage, this.getViewPassage(this.story.startPassageName));

        // todo if format - emit FormatLoaded
    }

    /*********
     * LOGIC
     *********/
    private onPassagePrepared(passage: ITwinePassage) {
        this.showPassage(passage);
    }

    private showPassage(passage: ITwinePassage) {
        EventBus.emit(GameEvents.showPassage, passage);
    }


    private onLinkClick(name: string) {
        EventBus.emit(GameEvents.preparePassage, this.getViewPassage(name));
    }

    /*********
     * helpers
     *********/

    // выполнить скрипт, забинденный на gameState
    private exeScript(script: string) {
        let result = null;

        try {
            const func = new Function(script).bind(this.gameState); // создаю функцию из строки
            result = func(); // исполняю функцию
        }catch (e) {
            // todo сделать вывод без консоли, оповещение
            // м.б. запись в историю ошибок
            // потому что сейчас весь консольный лог в продакшене чистится
            console.warn(' Wonder - UserScript error:'+e)
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

        this.execScripts(viewPassage);

        return new PageViewData(
            viewPassage,
            this.gameState,
            this.gameConfig);
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
