import {IAppState} from '../../twine-game/AppState';

export interface ISaveApiAppDataGetter {
    ():IAppState
}

export interface ISaveApiAppDataHandler {
    (state: IAppState): void
}

export interface IStateClient {
    onStateLoad: ISaveApiAppDataHandler;
    getState: ISaveApiAppDataGetter;
}
