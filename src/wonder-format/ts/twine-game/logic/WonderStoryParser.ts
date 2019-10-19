/**
 *  Парсинг параметров, переданных через специальные passage
 */
import {GameConfig, VisibleParameter} from "./GameConfig";
import {Story} from "../../parser/models/Story";
import {WONDER} from "../../Constants";
import {Passage} from "../../parser/models/Passage";

export class WonderStoryParser {
    static parse(story: Story, state: object, config: GameConfig) {

        parseConfig(story.passageHash[WONDER.passages.config], state, config)

    }
}

interface IPassageParser {
    (passage: Passage, state: object, config: GameConfig): void;
}


function parseConfig(passage: Passage, state: object, config: GameConfig) {
    if (passage == null) return;

    const lines = splitLines(passage.content);
    lines.forEach(str => {
        str = str.trim();
        if (str.length == 0) return;

        parseVar(str, state, config);

    })
}

function parseVar(str: string, state: object, config: GameConfig) {
    if (beginsWith(str, WONDER.markLang.varStart) == false) return;

    console.log(`has var`, str);

    // начинается с varStart - пилим
    const parts = str.split(WONDER.markLang.commandSplitter);

    const varName = parts[1].trim();
    const varValue = parts[2] || "0";
    const varSelector = parts[3];

    state[varName] = parseFloat(varValue);
    if (varSelector) {
        config.uiParams.push(new VisibleParameter(
            varName, varSelector
        ))
    }
}

function splitLines(str: string): Array<string> {
    return str.split("\n");
}

function beginsWith(str: string, begin: string): boolean {
    return str.indexOf(begin) == 0;
}