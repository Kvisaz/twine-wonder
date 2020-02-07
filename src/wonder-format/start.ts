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

const logic = new GameLogic();
const view = new GameView();

view.injectStyle(DEFAULT_STYLE);
view.injectStyle(story.style);

logic.loadStory(story);