import {ICollectionState} from './collections/CollectionInterfaces';

export interface IRunTimeState {
    gameVars: object; // любые кастомные переменные
    collections?: ICollectionState; // коллекции
}
