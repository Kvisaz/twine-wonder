import {parseStory} from "./ts/parser/TwineParser";

// @ts-ignore from webpack
const VERSION = VERSION_INFO;

console.log(`Hello, it\`s Twine Wonder parser ${VERSION}`);

const story = parseStory();

console.log(`story parsed = `, story);