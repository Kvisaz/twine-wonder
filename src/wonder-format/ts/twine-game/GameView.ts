import {EventBus} from "../app-core/EventBus";
import {GameEvents} from "./GameEvents";
import {Story} from "../parser/models/Story";
import {Passage} from "../parser/models/Passage";

export class GameView {
    constructor() {
        EventBus.getInstance()
            .sub(GameEvents.onStoryLoaded, (message, data) => this.onStoryLoaded(data))
            .sub(GameEvents.preparePassage, (message, data) => this.preparePassage(data))
            .sub(GameEvents.showPassage, (message, data) => this.showPassage(data))
    }

    private onStoryLoaded(story: Story) {
        console.log(`onStoryLoaded`, story);

    }

    private preparePassage(passage: Passage) {
        console.log(`preparePassage`, passage);
    }

    private showPassage(passage: Passage) {
        console.log(`showPassage`, passage);
    }
}