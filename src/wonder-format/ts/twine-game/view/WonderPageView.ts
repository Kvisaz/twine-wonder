import {PagePairView} from "./PagePairView";
import {EventBus} from "../../app-core/EventBus";
import {GameEvents} from "../GameEvents";
import {ViewBuilder} from "./ViewBuilder";
import {COMMON_CSS, PASSAGE_TEMPLATE, PAGE_TEMPLATE} from "../../Constants";
import {formatTwinePassageAsHTML} from "../../parser/FormatTwinePassageAsHTML";
import {ITwinePassage} from "../../abstract/TwineModels";

export class WonderPageView {

    private pageView: PagePairView;
    private pageBuilder: ViewBuilder;
    private contentBuilder: ViewBuilder;

    constructor(private parent: Element) {
        this.pageView = new PagePairView();
        this.pageBuilder = new ViewBuilder(PAGE_TEMPLATE);
        this.contentBuilder = new ViewBuilder(PASSAGE_TEMPLATE);
        this.contentBuilder.setContentFormatter(formatTwinePassageAsHTML);

        EventBus.getInstance()
            .sub(GameEvents.onPageFormatLoaded,
                (message, format) => this.pageBuilder.setTemplate(format))
            .sub(GameEvents.onContentFormatLoaded,
                (message, format) => this.contentBuilder.setTemplate(format))
    }

    addNextPage(passage: ITwinePassage) {
        const page = this.buildPageView(passage);
        this.pageView.addPage(page);
        return page;
    }

    showNextPage() {
        this.pageView.next();
    }


    /**********************
     *   show page
     *********************/

    private buildPageView(passage: ITwinePassage): Element {
        const SOURCE = passage.content;

        const passageView = this.contentBuilder.build(SOURCE);
        const pageView: Element = this.pageBuilder.build();

        pageView.classList.add(COMMON_CSS.displayNone);
        pageView.appendChild(passageView);

        this.parent.appendChild(pageView);
        return <Element>pageView;
    }
}
