import {IPageViewChecker, IWonderHistory} from '../../abstract/WonderInterfaces';
import {WonderHistoryState} from '../AppState';

export class WonderHistory implements IWonderHistory, IPageViewChecker {
    private pages: Array<string>;
    private pagesHash: IHasHash;

    constructor() {
        this.clear();
    }

    getState(): WonderHistoryState {
        return [
            ...this.pages
        ]
    }

    loadState(state: WonderHistoryState) {
        this.pages = [
            ...state
        ]
    }

    clear() {
        this.pages = [];
        this.pagesHash = {};
    }

    add(name: string) {
        // защита от повторов
        if (this.getLast() == name) return;

        this.pages.push(name);
        this.pagesHash[name] = true;
    }

    isViewed(name: string): boolean {
        return this.pagesHash[name] == true;
    }

    pop(): string {
        return this.pages.pop();
    }

    canGoBack(name: string): boolean {
        const hasHistory = this.pages.length > 0;
        if (!hasHistory) return false;

        const hasSinglePage = this.pages.length == 1;
        const hasSameFirstPage = this.pages[0] && this.pages[0] == name;

        return !(hasSinglePage && hasSameFirstPage);
    }

    getLast(): string {
        return this.pages[this.pages.length - 1];
    }
}

interface IHasHash {
    [name: string]: boolean
}
