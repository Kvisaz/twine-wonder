import {IWonderHistoryState} from './logic/WonderHistoryInterfaces';
import {IWonderCollectionMap} from './logic/collections/CollectionInterfaces';
import {IMap} from '../abstract/WonderInterfaces';

export interface IAppState {
    gameVars: object; // любые кастомные переменные
    history: IWonderHistoryState; // самое важное - где сейчас остановились
}

// состояние юзера - не меняется при рестарте
export interface IUserState {
    /**
     * @deprecated - коллекции инициализируется в начале игры
     */
    collectionMap: IWonderCollectionMap;
    visitedPageMap: IMap<boolean>;
}

export class AppState implements IAppState {
    gameVars = {};
    history = {
        pagesHash: {},
        pages: []
    };
}

export class UserState implements IUserState {
    /**
     * @deprecated - коллекции инициализируется в начале игры
     */
    collectionMap = {};
    visitedPageMap = {};
}
