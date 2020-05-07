import {parseTwineData} from "./ts/parser/TwineParser";
import {GameLogic} from "./ts/twine-game/GameLogic";
import {GameView} from "./ts/twine-game/GameView";
import {DEFAULT_STYLE} from "./ts/Constants";

// @ts-ignore from webpack
const VERSION = VERSION_INFO;

console.log(`..............................`);
console.log(`Twine Wonder parser ${VERSION}`);
console.log(`..............................`);
const story = parseTwineData();
console.log(`story parsed = `, story);

const view = new GameView();
const logic = new GameLogic();

logic.loadStory(story);
