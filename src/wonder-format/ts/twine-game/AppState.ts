import {IWonderHistoryState} from './logic/WonderHistoryInterfaces';

export interface IAppState {
    passage: string; // текущий пассаж
    history?: IWonderHistoryState; // самое важное - где сейчас остановились
    runTime?: object; // данные игры
}
