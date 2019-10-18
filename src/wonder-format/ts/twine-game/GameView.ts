import {EventBus} from "../app-core/EventBus";
import {GameEvents} from "./GameEvents";
import {Story} from "../parser/models/Story";
import {Passage} from "../parser/models/Passage";
import {WONDER} from "../Constants";
import {WonderPageView} from "./view/WonderPageView";

export class GameView {
    private el: Element;
    private pageView: WonderPageView;

    constructor() {
        this.el = document.createElement("div");
        this.el.id = WONDER.contentId;
        document.body.appendChild(this.el);

        this.pageView = new WonderPageView(this.el);

        EventBus.getInstance()
            .sub(GameEvents.onStoryLoaded, (message, data) => this.onStoryLoaded(data))
            .sub(GameEvents.preparePassage, (message, data) => this.preparePassage(data))
            .sub(GameEvents.showPassage, (message, data) => this.showPassage(data))
    }

    /**********************
     *   events
     *********************/

    private onStoryLoaded(story: Story) {
        console.log(`onStoryLoaded`, story);

    }

    private preparePassage(passage: Passage) {
        console.log(`preparePassage`, passage);
        this.pageView.addNextPage(passage);
        EventBus.emit(GameEvents.onPassagePrepared, passage);
    }

    private showPassage(passage: Passage) {
        console.log(`showPassage`, passage);
        this.pageView.showNextPage();
    }


}