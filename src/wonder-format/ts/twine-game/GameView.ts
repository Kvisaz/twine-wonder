import {EventBus} from "../app-core/EventBus";
import {GameEvents, PageViewData} from "./GameEvents";
import {WONDER} from "../Constants";
import {WonderPageView} from "./view/WonderPageView";
import {DomUtils} from "../app-core/DomUtils";
import {VisibleParams} from "./logic/GameConfig";
import {ITwinePassage, ITwineStory} from "../abstract/TwineModels";
import {IPageCanGoBack, IPageViewChecker} from '../abstract/WonderInterfaces';
import {STORY_STORE} from './Stores';

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
        const passage: ITwinePassage = pageViewData.passage;

        console.log(`preparePassage`, passage);
        const page: Element = this.pageView.addNextPage(passage);

        this.setPageNameAsBodyId(pageViewData);

        this.markVisitedLinks(page, pageViewData.viewChecker);
        this.showBackLink(page, pageViewData.pageCanGoBack, passage);

        // страница добавлена, но еще не видима, можно менять DOM
        this.injectParams(page, pageViewData.config.uiParams, pageViewData.state);


        EventBus.emit(GameEvents.onPassagePrepared, passage);
    }

    private setPageNameAsBodyId(pageViewData: PageViewData) {
        document.body.id = pageViewData.passage.name;
        document.body.className = pageViewData.passage.tags;
    }

    private showPassage(passage: ITwinePassage) {
        console.log(`showPassage`, passage);
        this.pageView.showNextPage();
    }


    private injectParams(page: Element, uiParams: VisibleParams, state: object) {
        uiParams.forEach(uP => {
            console.log(`uP`, uP);
            const paramName = uP.name;
            const paramValue = state[uP.name];
            const el = page.querySelector(uP.name);
            if (el) {
                el.innerHTML = paramName + ":" + paramValue;
            }
        })
    }

    private markVisitedLinks(page: Element, viewChecker: IPageViewChecker) {
        const links: NodeListOf<HTMLElement> = page.querySelectorAll(`.${WONDER.linkClass}`);

        const passageMap = STORY_STORE.story.passageHash;

        let next: HTMLElement, nextLinkName: string;
        for (let i = 0; i < links.length; i++) {
            next = links[i];
            nextLinkName = next.dataset["id"];
            if (viewChecker.isViewed(nextLinkName)) {
                next.classList.add(WONDER.visitedClass);
            }

            // теги пассажей
            const linkPassage = passageMap[nextLinkName] as ITwinePassage
            if (linkPassage && linkPassage.tags) {
                next.className = next.className + ' ' + linkPassage.tags;
            }
        }
    }

    private showBackLink(page: Element, canGoBack: IPageCanGoBack, passage: ITwinePassage) {
        const backButton: HTMLElement = page.querySelector(`.${WONDER.backClass}`);
        if (backButton == null) return;

        const canShowBackButton = canGoBack.canGoBack(passage.name);

        if (canShowBackButton) backButton.classList.remove(WONDER.invisibleClass);
        else backButton.classList.add(WONDER.invisibleClass);
    }
}
