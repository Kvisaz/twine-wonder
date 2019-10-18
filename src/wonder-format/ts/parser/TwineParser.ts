import {Story} from "./models/Story";
import {Passage} from "./models/Passage";
import {PASSAGE_SELECTOR, STORY_SELECTOR} from "../Constants";

export function parseStory(selector: string = STORY_SELECTOR): Story {
    const el = document.body.querySelector(selector);

    const startNodePid = parseFloat(el.getAttribute("startnode"));
    let startNodeName = '';

    const passageCollection = el.querySelectorAll(PASSAGE_SELECTOR);
    const passageArray = Array.prototype.slice.call(passageCollection);

    const STARTER_SCRIPT = el.querySelector("script").innerHTML;
    const passageHash = {}
    const passages = passageArray.map(el => {
        const passage = parsePassage(el);
        if (passageHash[passage.id]) {
            console.warn(`duplicate passage id ${passage.id}`);
        }
        passageHash[passage.name] = passage;
        if (startNodePid == passage.id) {
            startNodeName = passage.name;
        }
        return passage;
    });

    return new Story(
        el.getAttribute("name"),
        startNodeName,
        el.getAttribute("creator"),
        el.getAttribute("creator-version"),
        el.getAttribute("format"),
        el.getAttribute("format-version"),
        el.getAttribute("options"),
        STARTER_SCRIPT,
        passages,
        passageHash
    )
}

function parsePassage(el: Element): Passage {
    return new Passage(
        parseFloat(el.getAttribute("pid")),
        el.getAttribute("name"),
        el.getAttribute("tags"),
        htmlDecode(el.innerHTML),
    )
}

function htmlDecode(input): string {
    const e = document.createElement('textarea');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}