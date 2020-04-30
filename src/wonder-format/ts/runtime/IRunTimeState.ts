import {ICollectionState} from './Collections';

export interface IRunTimeState {
    gameVars: object; // любые кастомные переменные
    collections?: ICollectionState; // коллекции
}
