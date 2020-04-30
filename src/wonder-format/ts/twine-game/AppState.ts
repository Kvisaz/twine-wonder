export interface IAppState {
    passage: string; // текущий пассаж
    history?: WonderHistoryState; // самое важное - где сейчас остановились
    runTime?: object; // данные игры
}

export type WonderHistoryState = Array<string>;
