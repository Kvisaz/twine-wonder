import {parseStory} from "./ts/parser/TwineParser";
import {GameLogic} from "./ts/twine-game/GameLogic";
import {GameView} from "./ts/twine-game/GameView";

// @ts-ignore from webpack
const VERSION = VERSION_INFO;

console.log(`Hello 1, it\`s Twine Wonder parser ${VERSION}`);
const story = parseStory();
console.log(`story parsed = `, story);

const logic = new GameLogic();
const view = new GameView();

logic.loadStory(story);