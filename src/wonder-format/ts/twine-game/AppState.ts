export interface IAppState {
    passage: string; // текущий пассаж
    game: object; // произвольные переменные игры
    history?: WonderHistoryState; // самое важное - где сейчас остановились
    collections?: ICollectibleState;
}

export type WonderHistoryState = Array<string>;

export interface ICollectibleState {
    // todo
}
