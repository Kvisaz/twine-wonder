/**
 *  Парсинг расширенных команд формата Wonder
 */
import {GameConfig, VisibleParameter} from "./GameConfig";
import {WONDER} from "../../Constants";
import {ITwinePassage, ITwineStory} from "../../parser/models/TwineModels";

export class WonderStoryParser {
    static parse(story: ITwineStory, state: object, config: GameConfig) {
        parseConfig(story.passageHash[WONDER.passages.config], state, config)
    }
}



function parseConfig(passage: ITwinePassage, state: object, config: GameConfig) {
    if (passage == null) return;

    const lines = splitLines(passage.content);

    console.log(`parseConfig `);
    lines.forEach(str => {
        str = str.trim();
        if (str.length == 0) return;
        console.log(`str = `, str);
        parseVar(str, state, config);
    })
}

function parseVar(str: string, state: object, config: GameConfig) {
    if (beginsWith(str, WONDER.markLang.varStart) == false) return;

    console.log(`has var`, str);

    // начинается с varStart - пилим
    const parts = str.split(WONDER.markLang.commandSplitter);
    console.log(`parts`, parts);

    const varName = parts[1].trim();
    const varValue = parts[2] || "0";
    const varLabel = parts[3];


    state[varName] = parseFloat(varValue);
    console.log(`varLabel `, varLabel);
    console.log(`parts `, parts);
    if (varLabel) {
        config.uiParams.push(new VisibleParameter(
            varName, varLabel
        ))
    }
}

function splitLines(str: string): Array<string> {
    return str.split("\n");
}

function beginsWith(str: string, begin: string): boolean {
    return str.indexOf(begin) == 0;
}