import {ICollectionState} from './collections/CollectionInterfaces';
import {IAppState} from '../twine-game/AppState';

export interface IRunTimeState {
    gameVars: object; // любые кастомные переменные
    collections?: ICollectionState; // коллекции
}

export interface IStateHandler {
    onStateLoad(state: IAppState);
}
