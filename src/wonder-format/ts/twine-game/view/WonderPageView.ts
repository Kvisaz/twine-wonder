import {PagePairView} from "./PagePairView";
import {Passage} from "../../parser/models/Passage";
import {PageFormat} from "./PageFormat";
import {EventBus} from "../../app-core/EventBus";
import {GameEvents} from "../GameEvents";
import {DomUtils} from "../../app-core/DomUtils";
import {COMMON_CSS} from "../../app-core/COMMON_CSS";

export class WonderPageView {

    private pageView: PagePairView;
    private pageFormat: PageFormat;

    constructor(private parent: Element) {
        this.pageView = new PagePairView();
        this.pageFormat = new PageFormat();

        EventBus.getInstance()
            .sub(GameEvents.onFormatLoaded, (message, format) => this.pageFormat.setFormat(format))
    }

    addNextPage(passage: Passage) {
        const page = this.buildPageView(passage);
        this.pageView.addPage(page);
    }

    showNextPage() {
        this.pageView.next();
    }


    /**********************
     *   show page
     *********************/

    private buildPageView(passage: Passage): Element {
        const pageView = this.pageFormat.buildPage(this.buildPassageView(passage));
        pageView.classList.add(COMMON_CSS.displayNone);
        this.parent.appendChild(pageView);
        return <Element>pageView;
    }

    private buildPassageView(passage: Passage): Element {
        // todo формат!
        return <Element>DomUtils.elementFromTemplate(`<div>${passage.content}</div>`);
    }
}