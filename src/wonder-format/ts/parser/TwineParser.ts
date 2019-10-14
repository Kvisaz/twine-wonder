import {Story} from "./models/Story";
import {Passage} from "./models/Passage";

const STORY_SELECTOR = "tw-storydata";
const PASSAGE_SELECTOR = "tw-passagedata";

export function parseStory(selector: string = STORY_SELECTOR): Story {
    const el = document.body.querySelector(selector);

    const passageCollection = el.querySelectorAll(PASSAGE_SELECTOR);
    const passageArray = Array.prototype.slice.call(passageCollection);

    const STARTER_SCRIPT = el.querySelector("script").innerHTML;
    const passages = passageArray.map(el => parsePassage(el));

    return new Story(
        el.getAttribute("name"),
        parseFloat(el.getAttribute("startnode")),
        el.getAttribute("creator"),
        el.getAttribute("creator-version"),
        el.getAttribute("format"),
        el.getAttribute("format-version"),
        el.getAttribute("options"),
        STARTER_SCRIPT,
        passages
    )
}

function parsePassage(el: Element): Passage {
    return new Passage(
        parseFloat(el.getAttribute("pid")),
        el.getAttribute("name"),
        el.getAttribute("tags"),
        el.innerHTML,
    )
}