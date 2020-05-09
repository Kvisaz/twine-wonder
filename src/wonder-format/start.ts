import {GameLogic} from "./ts/twine-game/GameLogic";
import {GameView} from "./ts/twine-game/GameView";
import {getTwineStoryStyle} from './ts/parser/TwineParser';

// @ts-ignore from webpack
const VERSION = VERSION_INFO;

console.log(`..............................`);
console.log(`Twine Wonder parser ${VERSION}`);
console.log(`..............................`);

// быстро берем стиль из ноды
// чтобы добавить его к прелоадеру
const storyStyle = getTwineStoryStyle();
const view = new GameView(storyStyle);
const logic = new GameLogic();
logic.start();
