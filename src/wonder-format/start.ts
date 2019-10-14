import { parseStory } from "./ts/parser/TwineParser";

console.log('Hello, it\`s Twine Wonder parser ${version}');

const story = parseStory();

console.log(`story parsed = `, story);