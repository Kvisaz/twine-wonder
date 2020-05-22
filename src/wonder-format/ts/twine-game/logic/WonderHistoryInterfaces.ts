import {IMap} from '../../abstract/WonderInterfaces';

export interface IWonderHistoryState {
    pages: Array<string>;
    pagesHash: IMap<boolean>;
}
