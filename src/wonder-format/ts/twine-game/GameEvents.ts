import {Passage} from "../parser/models/Passage";

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
    ) {
    }
}