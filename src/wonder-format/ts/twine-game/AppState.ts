import {IWonderHistoryState} from './logic/WonderHistoryInterfaces';

export interface IAppState {
    history: IWonderHistoryState; // самое важное - где сейчас остановились
    runTime: object; // данные игры
}

export class AppState implements IAppState {
    history: IWonderHistoryState;
    runTime: object;

    constructor() {
        this.history = {
            pagesHash: {},
            pages: []
        }

        this.runTime = {

        }
    }
}
