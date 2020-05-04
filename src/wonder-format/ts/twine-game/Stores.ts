import {ITwineStory} from '../abstract/TwineModels';
import {IAppState} from './AppState';
import {SuperStore} from '../app-core/SuperStore';

class StoryStore {
    story: ITwineStory;
}

export const STORY_STORE = new StoryStore();

class AppStore {
    state: IAppState;
}

export const STORE = new SuperStore<IAppState>({
    passage: null
});
