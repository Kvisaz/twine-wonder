import {GameConfig} from "./logic/GameConfig";
import {ITwinePassage} from "../abstract/TwineModels";
import {IMap} from '../abstract/WonderInterfaces';
import {PRELOAD_PAGE_TEMPLATE, WONDER} from '../Constants';

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
    onButtonClick = "onButtonClick",        // показа пассаж
}

export class PageViewData {
    constructor(
        public passage: ITwinePassage,
        public gameVars: object,
        public config: GameConfig,
        public canGoBack: boolean,
        public visitedPagesMap: IMap<boolean>,
        public pagesMap: IMap<ITwinePassage>
    ) {
    }
}

const PreloadPassage: ITwinePassage = {
    pid: WONDER.preloadId,
    position: '',
    name: WONDER.preloadId,
    tags: WONDER.preloadId,
    size: '',
    content: PRELOAD_PAGE_TEMPLATE
}


export class PreloadPageViewData extends PageViewData {
    constructor() {
        super(PreloadPassage,
            {},
            {uiParams: []},
            false,
            {},
            {}
        )
    }
}
