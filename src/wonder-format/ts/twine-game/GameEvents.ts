import {GameConfig} from "./logic/GameConfig";
import {ITwinePassage} from "../abstract/TwineModels";
import {IPageCanGoBack, IPageViewChecker} from '../abstract/WonderInterfaces';

export const enum GameEvents {
    onStoryLoaded = "onStoryLoaded",
    onStateLoad = "onStateLoad",
    onPageFormatLoaded = "onPageFormatLoaded",
    onContentFormatLoaded = "onPassageFormatLoaded",
    onCssLoaded = "onCssLoaded",

    preparePassage = "preparePassage", // подготовить пассаж перед показом
    onPassagePrepared = "onPassagePrepared", // пассаж подготовлен

    showPassage = "showPassage",        // показа пассаж

    onLinkClick = "onLinkClick",        // показа пассаж
    onBackClick = "onBackClick",        // показа пассаж
}

export class PageViewData {
    constructor(
        public passage: ITwinePassage,
        public gameVars: object,
        public config: GameConfig,
        public viewChecker: IPageViewChecker,
        public pageCanGoBack: IPageCanGoBack
    ) {
    }
}
