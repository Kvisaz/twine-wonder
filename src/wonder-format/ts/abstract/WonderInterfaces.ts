import {ITwinePassage, ITwineStory} from './TwineModels';
import {WonderHistoryState} from '../twine-game/AppState';

export interface IWonderStory extends ITwineStory {
    passages: Array<IWonderPage>,
    passageHash: IWonderPageHash,  // по name хранит passage c таким же name
}

export interface IWonderPageHash {
    [name: string]: IWonderPage;
}

export interface IWonderPage extends ITwinePassage {
    music: string;
}

export interface IPageViewChecker {
    isViewed(name: string): boolean; // даннная страница уже была прочитана
}

export interface IPageCanGoBack {
    canGoBack(name: string): boolean; // даннная страница уже была прочитана
}

export interface IWonderHistory extends IPageViewChecker, IPageCanGoBack {
    clear();

    add(name: string);

    pop(): string; // удалить последний элемент истории. В списке отмеченных останется

    getLast(): string; // вернуть последний

    getState(): WonderHistoryState;

    loadState(state: WonderHistoryState):void;
}
