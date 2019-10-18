import {PagePairView} from "./PagePairView";
import {Passage} from "../../parser/models/Passage";
import {EventBus} from "../../app-core/EventBus";
import {GameEvents} from "../GameEvents";
import {COMMON_CSS} from "../../app-core/COMMON_CSS";
import {ViewBuilder} from "./ViewBuilder";
import {PAGE_TEMPLATE, PASSAGE_TEMPLATE} from "../../Constants";
import {twinePassageFormatter} from "../../parser/TwinePassageFormatter";

export class WonderPageView {

    private pageView: PagePairView;
    private pageBuilder: ViewBuilder;
    private contentBuilder: ViewBuilder;

    constructor(private parent: Element) {
        this.pageView = new PagePairView();
        this.pageBuilder = new ViewBuilder(PAGE_TEMPLATE);
        this.contentBuilder = new ViewBuilder(PASSAGE_TEMPLATE);
        this.contentBuilder.setContentFormatter(twinePassageFormatter);

        EventBus.getInstance()
            .sub(GameEvents.onPageFormatLoaded,
                (message, format) => this.pageBuilder.setTemplate(format))
            .sub(GameEvents.onContentFormatLoaded,
                (message, format) => this.contentBuilder.setTemplate(format))
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
        const SOURCE = passage.content;

        const passageView = this.contentBuilder.build(SOURCE);
        const pageView: Element = this.pageBuilder.build();

        pageView.classList.add(COMMON_CSS.displayNone);
        pageView.appendChild(passageView);

        this.parent.appendChild(pageView);
        return <Element>pageView;
    }
}