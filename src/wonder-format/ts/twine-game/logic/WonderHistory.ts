import {IMap, IPageVisitChecker} from '../../abstract/WonderInterfaces';
import {IWonderHistoryState} from './WonderHistoryInterfaces';
import {STORE, STORY_STORE} from '../Stores';
import {ITwinePassage, ITwineStory} from '../../abstract/TwineModels';

export class WonderHistory implements IPageVisitChecker {
    constructor() {

    }

    private getState(): IWonderHistoryState {
        return STORE.state.history
    }

    private getStory(): ITwineStory {
        return STORY_STORE.story;
    }

    add(name: string) {

        if (name == null) return;
        if (this.getLast() == name) return; // защита от повторов

        this.getState().pages.push(name);
        this.getState().pagesHash[name] = true;
    }

    isVisited(name: string): boolean {
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

    getLastExisting(): string {
        const existingPages: IMap<ITwinePassage> = this.getStory().passageHash;
        const PAGES: Array<string> = this.getState().pages;

        let nextPage: string;
        for (let i = PAGES.length - 1; i >= 0; i--) {
            nextPage = PAGES[i];
            if (existingPages[nextPage] != null) return nextPage;
            else {
                PAGES.pop(); // удаляем последний несуществующий элемент
            }
        }

        return null;
    }


}
