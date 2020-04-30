export interface IWonderHistoryState {
    pages: Array<string>;
    pagesHash: IHasHash;
}

export interface IHasHash {
    [name: string]: boolean
}
