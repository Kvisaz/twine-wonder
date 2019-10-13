import {createTwineSource} from "./ts/HtmlTemplate";

const PACKAGE = require("../../package.json");

// @ts-ignore
import {installTwineFormat} from "./ts/TwineUtils";
import {getParserCode} from "./ts/parser/TwineParser";

console.log(`Версия ${PACKAGE.version}`);
console.log(`Репозиторий: ${PACKAGE.repository}`);

/**
 *  todo
 *  1. проект скрипты парсинга - чтобы они билдились до п.2
 *  2. проект - вот это вот
 */

const PARSER_SCRIPT = getParserCode();

installTwineFormat({
    name: `${PACKAGE.nameFormat}`, // Короткое название SAMPLE: "Twison"
    version: `${PACKAGE.version}`,    //   SAMPLE: "0.0.1"
    author: `${PACKAGE.author}`,    //   SAMPLE: "Mike Lazer-Walker"
    description: `${PACKAGE.description}`,     //   SAMPLE: "Export your Twine 2 story as a JSON document",
    proofing: false, // непонятно, в готовых дистрибутивах стоит false
    url: `${PACKAGE.repository}`, // ссылка на сайт, можно гитхаб
    image: "assets/wonder-icon.svg", // ссылка на картинку, в svg, относительно уже готового скрипта, 256 на 256 можно
    source: createTwineSource(PARSER_SCRIPT, ""),
});