import { parseStory } from "./ts/parser/TwineParser";

console.log(`Hello, it\`s Wonder parser`);

const story = parseStory();

console.log(`story parsed = `, story);