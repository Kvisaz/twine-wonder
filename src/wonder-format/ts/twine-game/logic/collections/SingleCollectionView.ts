/**
 *  Single Collection button + view
 *
 *   1. each turn
 *      - update buttons
 *      - update lists
 *   2. on button click
 *      - show list
 *   3. on list click
 *      - show page
 */
import {CollectionCSS} from './CollectionCSS';
import {ITwinePassage} from '../../../abstract/TwineModels';
import {ICollectionShowCallback, IWonderCollection} from './CollectionInterfaces';
import {STORY_STORE} from '../../Stores';
import {formatTwinePassageAsHTML} from '../../../parser/FormatTwinePassageAsHTML';
import {PASSAGE_TEMPLATE, REGEXP} from '../../../Constants';
import {DomUtils} from '../../../app-core/DomUtils';

export class SingleCollectionView {
    private readonly buttonEl: HTMLElement;
    private buttonTitleEl: HTMLElement;
    private buttonContentEl: HTMLElement;

    private readonly listEl: HTMLElement;
    private listTitleEl: HTMLElement;
    private listContentEl: HTMLElement;

    private readonly pageEl: HTMLElement;

    private collectionName: string;

    private onButtonClickCallback: ICollectionShowCallback;

    constructor(
        private buttonClass = CollectionCSS.button,
        private listClass = CollectionCSS.list,
        private pageClass = CollectionCSS.page
    ) {
        this.buttonEl = this.createButton(buttonClass);
        this.listEl = this.createList(listClass);
        this.pageEl = this.createPage(pageClass);
    }

    attach(el?: HTMLElement) {
        el = el || document.body;
        document.body.appendChild(this.listEl);
        document.body.appendChild(this.pageEl);
        el.appendChild(this.buttonEl);
    }

    update(collection: IWonderCollection) {
        this.updateButton(collection);
        this.updateListTitle(collection);
        this.updateList(collection);
    }

    onCollectionShow(callback: ICollectionShowCallback) {
        this.onButtonClickCallback = callback;
    }

    /********************
     *  create elements
     *******************/
    private createButton(className: string): HTMLElement {
        const bt = this.createDiv(className);

        this.buttonTitleEl = this.createDiv(CollectionCSS.buttonTitle);
        this.buttonContentEl = this.createDiv(CollectionCSS.buttonContent);

        bt.appendChild(this.buttonTitleEl);
        bt.appendChild(this.buttonContentEl);

        return bt;
    }

    private createList(className: string): HTMLElement {
        const list = this.createDiv(className);

        list.addEventListener('click', (e) => this.findItem(e));
        //list.addEventListener('mouseup', () => this.closeCollection());


        this.listTitleEl = this.createDiv(CollectionCSS.listTitle);
        this.listContentEl = this.createDiv(CollectionCSS.listContent);

        list.appendChild(this.listTitleEl);
        list.appendChild(this.listContentEl);

        return list;
    }

    private createPage(className: string): HTMLElement {
        const page = this.createDiv(className);
        page.addEventListener('mouseup', () => this.closePage());
        return page;
    }

    /********************
     *  UPDATE COLLECTION
     *******************/

    private updateButton(collection: IWonderCollection) {
        const BT = this.buttonEl;
        const TITLE = this.buttonTitleEl;
        const CONTENT = this.buttonContentEl;

        this.collectionName = collection.name;
        const collected = collection.collected.length;
        const total = collection.maxAmount;
        const title = collection.title;

        BT.dataset.collection = this.collectionName;

        // content
        TITLE.innerHTML = `${title}`;
        CONTENT.innerHTML = `${collected}/${total}`;

        // class
        const isCompleted = collected == total;
        const completedClass = isCompleted
            ? CollectionCSS.buttonCompleted
            : '';
        BT.className = CollectionCSS.button +
            ' ' + this.collectionName +
            ' ' + completedClass;
    }

    private updateListTitle(collection: IWonderCollection) {
        this.listTitleEl.innerHTML = collection.title;
    }

    private updateList(collection: IWonderCollection) {

        const LIST = this.listEl;
        const LIST_CONTENT = this.listContentEl;

        // clear list
        LIST_CONTENT.innerHTML = '';

        // create code
        const passageMap = STORY_STORE.story.passageHash;
        let newList = '';
        collection.collected.forEach((name) => {
            const passage = passageMap[name];
            const title = this.getPageTitle(passage.content);
            const itemTemplate = this.getItemTemplate(title, name);
            newList += itemTemplate;
        });

        // fill list
        LIST_CONTENT.innerHTML = newList;

        // list classes
        LIST.className = CollectionCSS.list + ' ' + this.collectionName;
    }

    private updatePage(passage: ITwinePassage) {
        const PAGE = this.pageEl;

        // clear
        PAGE.innerHTML = '';

        // parse content
        // чистим контент от возможных скриптов
        const cleanedContent = passage.content.replace(REGEXP.exeScript,
            '');
        const PAGE_TEMPLATE = PASSAGE_TEMPLATE;
        const html = formatTwinePassageAsHTML(cleanedContent, PAGE_TEMPLATE);

        console.log('updatePage', html, passage);

        // fill list
        PAGE.innerHTML = html;
    }

    /********************
     *  SHOW LIST
     *******************/
    showCollection() {
        this.listEl.classList.add(CollectionCSS.listShow);
        if (this.onCollectionShow) this.onButtonClickCallback(this.collectionName);
    }

    closeCollection() {
        this.listEl.classList.remove(CollectionCSS.listShow);
        this.closePage(); // если была открыта страница - убираем и её
    }

    /********************
     *  FIND PAGE
     *******************/
    private findItem(e: MouseEvent) {
        const item: HTMLElement = <HTMLElement>DomUtils.closest(e.target as HTMLElement, `.${CollectionCSS.listItem}`);
        if (item) this.onItemClick(item.dataset.name);
    }

    private onItemClick(name: string) {
        const passage = STORY_STORE.story.passageHash[name];
        if (passage == null) {
            console.warn('SingleCollectionView.onItemClick: cannot find' + name);
            return;
        }

        this.updatePage(passage);
        this.showPage();
    }

    /********************
     *  PARSE PAGE
     *******************/
    private getPageTitle(passageContent: string): string {
        let title = innerText(passageContent, '<h1>', '</h1>');
        if (title == null || title.length == 0) {
            title = getFirstLine(passageContent);
            }
        return title;
    }

    /********************
     *  SHOW PAGE
     *******************/
    private showPage() {
        this.pageEl.classList.add(CollectionCSS.pageShow);
    }

    private closePage() {
        this.pageEl.classList.remove(CollectionCSS.pageShow);
    }

    /********************
     *  TEMPLATES
     *******************/
    private createDiv(className: string): HTMLElement {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }

    private getItemTemplate(title: string, name: string): string {
        return `<div class=${CollectionCSS.listItem} data-name="${name}">${title}</div>`
    }


}


/**
 * Вернуть первую строку между двумя тегами/кусками текста
 * @method innerText
 * @param {string} str  исходная строка
 * @param {string} startTag
 * @param {string} endTag
 * @return {string}
 */
function innerText(str, startTag, endTag, withTags = false) {
    const startIndex = str.indexOf(startTag);

    if (startIndex < 0) return '';

    const endIndex = str.indexOf(endTag, startIndex);
    const startOffset = withTags ? 0 : startTag.length;
    const endOffset = withTags ? endTag.length : 0;
    return str.substring(startIndex + startOffset, endIndex + endOffset);
}

function getFirstLine(str) {
    const breakIndex = str.indexOf("\n");

    // consider that there can be line without a break
    if (breakIndex === -1) {
        return str;
    }

    return str.substr(0, breakIndex);
}
