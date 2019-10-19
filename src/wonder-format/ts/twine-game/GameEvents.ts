import {Passage} from "../parser/models/Passage";
import {GameConfig} from "./logic/GameConfig";

export enum GameEvents {
    onStoryLoaded = "onStoryLoaded",
    onPageFormatLoaded = "onPageFormatLoaded",
    onContentFormatLoaded = "onPassageFormatLoaded",
    onCssLoaded = "onCssLoaded",

    preparePassage = "preparePassage", // подготовить пассаж перед показом
    onPassagePrepared = "onPassagePrepared", // пассаж подготовлен

    showPassage = "showPassage",        // показа пассаж

    onLinkClick = "onLinkClick",        // показа пассаж

}

export class PageViewData {
    constructor(
        public passage: Passage,
        public state: object,
        public config: GameConfig,
    ) {
    }
}