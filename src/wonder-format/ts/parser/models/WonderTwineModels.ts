import {ITwinePassage, ITwineStory} from './TwineModels';

export interface IWonderStory extends ITwineStory{
    passages: Array<IWonderLocation>,
}

export interface IWonderLocation extends ITwinePassage {
    music: string;
}
