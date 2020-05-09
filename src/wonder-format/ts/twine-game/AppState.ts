import {IWonderHistoryState} from './logic/WonderHistoryInterfaces';
import {IWonderCollectionMap} from './logic/collections/CollectionInterfaces';

export interface IAppState {
    gameVars: object; // любые кастомные переменные
    history: IWonderHistoryState; // самое важное - где сейчас остановились
}

// состояние юзера - не меняется при рестарте
export interface IUserState {
    collectionMap: IWonderCollectionMap;
}

export class AppState implements IAppState {
    gameVars = {};
    history = {
        pagesHash: {},
        pages: []
    };
}

export class UserState implements IUserState {
    collectionMap = {}
}
