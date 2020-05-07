import {IPageViewChecker} from '../../abstract/WonderInterfaces';
import {IWonderHistoryState} from './WonderHistoryInterfaces';
import {STORE} from '../Stores';

export class WonderHistory implements IPageViewChecker {
    constructor() {

    }
    getState(): IWonderHistoryState {
        return STORE.state.history
    }
    add(name: string) {

        if (name == null) return;
        if (this.getLast() == name) return; // защита от повторов

        this.getState().pages.push(name);
        this.getState().pagesHash[name] = true;
    }

    isViewed(name: string): boolean {
        return this.getState().pagesHash[name] == true;
    }

    pop(): string {
        return this.getState().pages.pop();
    }

    canGoBack(name: string): boolean {
        const PAGES = this.getState().pages;
        const hasHistory = PAGES.length > 0;
        if (!hasHistory) return false;

        const hasSinglePage = PAGES.length == 1;
        const hasSameFirstPage = PAGES[0] && PAGES[0] == name;

        return !(hasSinglePage && hasSameFirstPage);
    }

    getLast(): string {
        const PAGES = this.getState().pages;
        return PAGES[PAGES.length - 1];
    }
}
