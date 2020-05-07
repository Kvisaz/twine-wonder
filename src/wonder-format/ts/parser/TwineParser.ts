import {ITwinePassage, ITwineStory} from "../abstract/TwineModels";

export function parseTwineData(): ITwineStory {
    const storyEl = document.body.querySelector('tw-storydata');

    const story = <ITwineStory>elAttributesToObject(storyEl);

    story.style = getTwineStoryStyle();
    story.script = document.querySelector('#twine-user-script').innerHTML.trim();

    const passageArray = Array.prototype.slice.call(storyEl.querySelectorAll('tw-passagedata'))

    story.passageHash = {};
    story.passages = passageArray.map(passageEl => {
        const passage = <ITwinePassage>elAttributesToObject(passageEl);
        if (story.passageHash[passage.pid]) {
            console.warn(`duplicate passage id ${passage.pid}`);
        }
        story.passageHash[passage.name] = passage;
        if (story.startnode == passage.pid) {
            story.startPassageName = passage.name;
        }

        passage.content = htmlDecode(passageEl.innerHTML.trim());
        return passage;
    });

    return story;
}

export function getTwineStoryStyle(): string {
    return document.querySelector('#twine-user-stylesheet').innerHTML.trim();
}

function htmlDecode(input): string {
    const e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

// convert attributes to fields
function elAttributesToObject(el: Element): object {
    const obj = {};
    for (let i = 0, attrs = el.attributes, n = attrs.length; i < n; i++) {
        obj[kebabToCamel(attrs[i].name)] = attrs[i].value;
    }
    return obj;
}

function kebabToCamel(str: string): string {
    const arr = str.split('-');
    let capital = arr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item);
    // ^-- change here.
    let capitalString = capital.join("");

    return capitalString;
}
