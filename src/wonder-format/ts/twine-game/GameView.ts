import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData} from "./GameEvents";
import {WONDER} from "../Constants";
import {WonderPageView} from "./view/WonderPageView";
import {DomUtils} from "../app-core/DomUtils";
import {VisibleParams} from "./logic/GameConfig";
import {ITwinePassage, ITwineStory} from "../parser/models/TwineModels";

export class GameView {
    private el: Element;
    private pageView: WonderPageView;

    constructor() {
        this.el = document.createElement("div");
        this.el.id = WONDER.contentId;
        document.body.appendChild(this.el);

        this.el.addEventListener("click", this);

        this.pageView = new WonderPageView(this.el);

        EventBus.getInstance()
            .sub(GameEvents.onStoryLoaded, (message, data) => this.onStoryLoaded(data))
            .sub(GameEvents.preparePassage, (message, data) => this.preparePassage(data))
            .sub(GameEvents.showPassage, (message, data) => this.showPassage(data))
    }

    handleEvent(e) {
        // выбрать первый линк
        const linkElement = <HTMLElement>DomUtils.closest(e.target, `.${WONDER.linkClass}`);
        if (linkElement) {
            const id = linkElement.dataset["id"];
            EventBus.emit(GameEvents.onLinkClick, id);
        }
    }


    injectStyle(style: string) {
        if (style.length == 0) return;

        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    /**********************
     *   events
     *********************/

    private onStoryLoaded(story: ITwineStory) {
        console.log(`onStoryLoaded`, story);

    }

    private preparePassage(pageViewData: PageViewData) {
        const passage = pageViewData.passage;

        console.log(`preparePassage`, passage);
        const page: Element = this.pageView.addNextPage(passage);

        // страница добавлена, но еще не видима, можно менять DOM
        this.injectParams(page, pageViewData.config.uiParams, pageViewData.state);


        EventBus.emit(GameEvents.onPassagePrepared, passage);
    }

    private showPassage(passage: ITwinePassage) {
        console.log(`showPassage`, passage);
        this.pageView.showNextPage();
    }


    private injectParams(page: Element, uiParams: VisibleParams, state: object) {
        uiParams.forEach(uP => {
            const paramValue = state[uP.name];
            const el = page.querySelector(uP.selector);
            if (el) {
                el.innerHTML = paramValue;
            }
        })
    }
}