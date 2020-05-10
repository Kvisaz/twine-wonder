import {ITwineStory} from '../abstract/TwineModels';
import {IAppState, IUserState} from './AppState';
import {IRunTimeCommand} from '../abstract/WonderInterfaces';

class StoryStore {
    story: ITwineStory;
}

export const STORY_STORE = new StoryStore();

class AppStore {
    state: IAppState;
    user: IUserState;
}

export const STORE = new AppStore();

class RunTimeStore {
    hasSave: boolean = false;
    textBuffer: Array<string> = [];
    commands: Array<IRunTimeCommand> = [];
}

export const RUNTIME_STORE = new RunTimeStore();
