import {Story} from "../parser/models/Story";
import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData} from "./GameEvents";
import {Passage} from "../parser/models/Passage";
import {REGEXP, WONDER} from "../Constants";
import {GameConfig} from "./logic/GameConfig";
import {WonderStoryParser} from "./logic/WonderStoryParser";

export class GameLogic {
    private story: Story;

    private gameConfig = new GameConfig();
    private gameState = {};

    constructor() {
        EventBus.getInstance()
            .sub(GameEvents.onPassagePrepared, (message, data) => this.onPassagePrepared(data))
            .sub(GameEvents.onLinkClick, (message, id: string) => this.onLinkClick(id))
    }

    loadStory(story: Story) {
        this.story = story;

        WonderStoryParser.parse(story, this.gameState, this.gameConfig);
        console.log(` loadStory `, this.gameState, this.gameConfig)

        EventBus.emit(GameEvents.onStoryLoaded, story);
        EventBus.emit(GameEvents.preparePassage, this.getViewPassage(this.story.startPassageName));

        // todo if format - emit FormatLoaded
    }

    /*********
     * LOGIC
     *********/
    private onPassagePrepared(passage: Passage) {
        console.log(`onPassagePrepared`, passage);
        // TODO вот сейчас можно ЗАИНЖЕКТИТЬ ПАРАМЕТРЫ
        this.showPassage(passage);
    }

    private showPassage(passage: Passage) {
        console.log(`showPassage`, passage);
        EventBus.emit(GameEvents.showPassage, passage);
    }


    private onLinkClick(name: string) {
        console.log(`onLinkClick ${name}`);
        EventBus.emit(GameEvents.preparePassage, this.getViewPassage(name));
    }

    /*********
     * helpers
     *********/

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
    private execScripts(viewPassage: Passage) {
        console.log(`execScripts........`);
        console.log(`viewPassage.content`, viewPassage.content);

        viewPassage.content = viewPassage.content
            .replace(REGEXP.exeScript,
                (match, catched) => {
                    //console.log(`match`, match);
                    let command = catched.trim();
                    const mustRender = command[0] == WONDER.command.show;
                    if (mustRender) command = "return " + command.substring(1);

                    console.log(`command`, command);
                    const func = new Function(command).bind(this.gameState);
                    const result = func();
                    const render = mustRender ? result : "";
                    return render;
                });
        console.log(`....... /execScripts`);
    }

}