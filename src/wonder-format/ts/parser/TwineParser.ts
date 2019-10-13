import {Story} from "./models/Story";
import {Passage} from "./models/Passage";

export function getParserStarterCode(): string {
    return "(" + startParsing + ")()";
}

const STORY_SELECTOR = "tw-storydata";
const PASSAGE_SELECTOR = "tw-passagedata";


export function startParsing() {
    console.log(`Hello, it\`s Wonder parser`);

    const story = parseStory(STORY_SELECTOR);

    console.log(`story parsed = `, story);
}

export function parseStory(selector: string): Story {
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