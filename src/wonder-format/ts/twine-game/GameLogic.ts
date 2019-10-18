import {Story} from "../parser/models/Story";
import {EventBus} from "../app-core/EventBus";
import {GameEvents} from "./GameEvents";
import {Passage} from "../parser/models/Passage";

export class GameLogic {
    private story: Story;

    constructor() {
        EventBus.getInstance()
            .sub(GameEvents.onPassagePrepared, (message, data) => this.onPassagePrepared(data))
    }

    loadStory(story: Story) {
        this.story = story;
        EventBus.emit(GameEvents.onStoryLoaded, story);
        EventBus.emit(GameEvents.preparePassage, this.getPassage(this.story.startNode));

        // todo if format - emit FormatLoaded
    }

    /*********
     * LOGIC
     *********/
    private onPassagePrepared(passage: Passage) {
        console.log(`onPassagePrepared`, passage);
        this.showPassage(passage);
    }

    private showPassage(passage: Passage) {
        console.log(`showPassage`, passage);
        EventBus.emit(GameEvents.showPassage, passage);
    }

    /*********
     * helpers
     *********/

    private getPassage(id: number): Passage {
        return this.story.passages[id];
    }
}