import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData} from "./GameEvents";
import {DEFAULT_STYLE, WONDER} from "../Constants";
import {WonderPageView} from "./view/WonderPageView";
import {DomUtils} from "../app-core/DomUtils";
import {VisibleParams} from "./logic/GameConfig";
import {ITwinePassage, ITwineStory} from "../abstract/TwineModels";
import {IMap} from '../abstract/WonderInterfaces';

export class GameView {
    private readonly el: Element;
    private pageView: WonderPageView;

    constructor(storyStyle: string) {
        this.injectStyle(DEFAULT_STYLE);
        this.injectStyle(storyStyle);
        this.el = document.createElement("div");
        this.el.id = WONDER.contentId;
        document.body.appendChild(this.el);

        this.el.addEventListener("click", this);

        this.pageView = new WonderPageView(this.el);

        EventBus.getInstance()
            .sub(GameEvents.onStoryLoaded, (message, data) => this.onStoryLoad(data))
            .sub(GameEvents.preparePassage, (message, data) => this.preparePassage(data))
            .sub(GameEvents.showPassage, (message, data) => this.showPassage(data))
    }


    injectStyle(style: string) {
        if (style.length == 0) return;

        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    /**********************
     *  user event listeners
     *********************/
    handleEvent(e) {
        if (this.checkLinkClick(e)) return;
        if (this.checkBackClick(e)) return;
    }

    private checkClick(e: MouseEvent, selector: string, callback: (el: HTMLElement, e: MouseEvent) => void): boolean {
        const linkElement: HTMLElement = <HTMLElement>DomUtils.closest(e.target as HTMLElement, selector);
        if (linkElement) callback(linkElement, e);
        return linkElement != null;
    }

    private checkLinkClick(e) {
        return this.checkClick(e,
            `.${WONDER.linkClass}`,
            (el: HTMLElement, e1) => {
                const id = el.dataset["id"];
                EventBus.emit(GameEvents.onLinkClick, id);
            }
        );
    }

    private checkBackClick(e: MouseEvent) {
        return this.checkClick(e,
            `.${WONDER.backClass}`,
            (el: HTMLElement, e1) => {
                EventBus.emit(GameEvents.onBackClick, null);
            }
        );
    }

    /**********************
     *   events
     *********************/

    private onStoryLoad(story: ITwineStory) {
    }

    private preparePassage(pageViewData: PageViewData) {
        const passage: ITwinePassage = pageViewData.passage;

        const page: Element = this.pageView.addNextPage(passage);

        this.setBody(passage);

        this.markVisitedLinks(page, pageViewData.visitedPagesMap, pageViewData.pagesMap);
        this.showBackLink(page, pageViewData.canGoBack, passage);

        // страница добавлена, но еще не видима, можно менять DOM
        this.injectParams(page, pageViewData.config.uiParams, pageViewData.gameVars);


        EventBus.emit(GameEvents.onPassagePrepared, passage);
    }

    private setBody(passage: ITwinePassage) {
        document.body.id = passage.name;
        document.body.className = passage.tags;
    }

    private showPassage(passage: ITwinePassage) {
        this.pageView.showNextPage();
    }


    private injectParams(page: Element, uiParams: VisibleParams, state: object) {
        uiParams.forEach(uP => {
            const paramName = uP.name;
            const paramValue = state[uP.name];
            const el = page.querySelector(uP.name);
            if (el) {
                el.innerHTML = paramName + ":" + paramValue;
            }
        })
    }

    private markVisitedLinks(page: Element, visited: IMap<boolean>, passageMap: IMap<ITwinePassage>) {
        const links: NodeListOf<HTMLElement> = page.querySelectorAll(`.${WONDER.linkClass}`);

        let next: HTMLElement, nextLinkName: string;
        for (let i = 0; i < links.length; i++) {
            next = links[i];
            nextLinkName = next.dataset["id"];
            if (visited[nextLinkName]) {
                next.classList.add(WONDER.visitedClass);
            }

            // теги пассажей
            const linkPassage = passageMap[nextLinkName];
            if (linkPassage && linkPassage.tags) {
                next.className = next.className + ' ' + linkPassage.tags;
            }
        }
    }

    private showBackLink(page: Element, canGoBack: boolean, passage: ITwinePassage) {
        const backButton: HTMLElement = page.querySelector(`.${WONDER.backClass}`);
        if (backButton == null) return;

        if (canGoBack) backButton.classList.remove(WONDER.invisibleClass);
        else backButton.classList.add(WONDER.invisibleClass);
    }
}
