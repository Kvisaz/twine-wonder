import {ITwineStory} from '../abstract/TwineModels';
import {IAppState} from './AppState';

class StoryStore {
    story: ITwineStory;
}

export const STORY_STORE = new StoryStore();

class AppStore {
    state: IAppState;
}

export const STORE = new AppStore();

class RunTimeStore {
    textBuffer: Array<string> = []
}

export const RUNTIME_STORE = new RunTimeStore();
