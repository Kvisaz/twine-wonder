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
import {ITwinePassage} from '../../abstract/TwineModels';
import {IWonderCollection} from './CollectionInterfaces';

export class SingleCollectionView {
    private readonly buttonEl: HTMLElement;
    private buttonTitleEl: HTMLElement;
    private buttonContentEl: HTMLElement;

    private readonly listEl: HTMLElement;
    private listTitleEl: HTMLElement;
    private listContentEl: HTMLElement;

    private readonly pageEl: HTMLElement;

    private passages: Array<ITwinePassage>;

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
        el.appendChild(this.listEl);
        el.appendChild(this.pageEl);
        el.appendChild(this.buttonEl);
    }

    update(collection: IWonderCollection) {
        const collected = collection.collected.length;
        const total = collection.maxAmount;
        const title = collection.title;

        // content
        this.buttonTitleEl.innerHTML = `${collection.title}`;
        this.buttonContentEl.innerHTML = `${collected}/${total}`;

        // class
        const isCompleted = collected == total;
        const className = isCompleted
            ? `${CollectionCSS.button} ${CollectionCSS.buttonCompleted}`
            : `${CollectionCSS.button} `;
        this.buttonEl.className = className;
    }

    updateData(passages: Array<ITwinePassage>) {
        this.passages = passages;
        this.updateCollection(passages);
    }

    /********************
     *  create elements
     *******************/
    private createButton(className: string): HTMLElement {
        const bt = this.createDiv(className);
        bt.addEventListener('mouseup', () => this.showCollection());

        this.buttonTitleEl = this.createDiv(CollectionCSS.buttonTitle);
        this.buttonContentEl  = this.createDiv(CollectionCSS.buttonContent);

        bt.appendChild(this.buttonTitleEl);
        bt.appendChild(this.buttonContentEl);

        return bt;
    }

    private createList(className: string): HTMLElement {
        const list = this.createDiv(className);

        list.addEventListener('click', (e) => this.findPage(e));
        list.addEventListener('mouseup', () => this.closeCollection());


        this.listTitleEl = this.createDiv(CollectionCSS.listTitle);
        this.listContentEl  = this.createDiv(CollectionCSS.listContent);

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
    private updateCollection(passages: Array<ITwinePassage>) {
        // clear list
        this.listEl.innerHTML = '';

        // create code
        let newList = '';
        passages.forEach((passage, index) => {
            const title = this.getPageTitle(passage.content);
            const itemTemplate = this.getItemTemplate(title, index);
            newList += itemTemplate;
        });

        // fill list
        this.listEl.innerHTML = newList;
    }

    /********************
     *  SHOW LIST
     *******************/
    private showCollection() {
        // todo
    }

    private closeCollection() {
        // todo
    }

    /********************
     *  FIND PAGE
     *******************/
    private findPage(e: MouseEvent) {

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
        // todo
    }

    private closePage() {
        // todo
    }

    /********************
     *  TEMPLATES
     *******************/
    private createDiv(className: string): HTMLElement {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }

    private getItemTemplate(title: string, id: number): string {
        return `<div class=${CollectionCSS.listItem} data-id="${id}">${title}</div>`
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
