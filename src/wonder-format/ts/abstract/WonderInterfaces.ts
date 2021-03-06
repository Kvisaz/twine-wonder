import {ITwinePassage, ITwineStory} from './TwineModels';

export interface IWonderStory extends ITwineStory {
    passages: Array<IWonderPage>,
    passageHash: IWonderPageHash,  // по name хранит passage c таким же name
}

export interface IMap<T> {
    [key: string]: T
}

export interface IStringMap extends IMap<string> {
}

export interface IWonderPageHash {
    [name: string]: IWonderPage;
}

export interface IWonderPage extends ITwinePassage {
    music: string;
}

export interface IPageVisitChecker {
    isVisited(name: string): boolean; // даннная страница уже была прочитана
}

export interface ILoadCallback {
    (data: any): any
}

export interface IMessageCallback {
    (message: string): any
}

export interface IRunTimeCommand {
    name: string;
    data?: any
}
