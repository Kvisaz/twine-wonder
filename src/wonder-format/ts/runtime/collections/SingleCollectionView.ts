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
import {ICollectionShowCallback, IWonderCollection} from './CollectionInterfaces';
import {STORY_STORE} from '../../twine-game/StoryStore';

export class SingleCollectionView {
    private readonly buttonEl: HTMLElement;
    private buttonTitleEl: HTMLElement;
    private buttonContentEl: HTMLElement;

    private readonly listEl: HTMLElement;
    private listTitleEl: HTMLElement;
    private listContentEl: HTMLElement;

    private readonly pageEl: HTMLElement;

    private passages: Array<ITwinePassage>;
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

        //list.addEventListener('click', (e) => this.findPage(e));
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
        this.collectionName = collection.name;
        const collected = collection.collected.length;
        const total = collection.maxAmount;
        const title = collection.title;

        this.buttonEl.dataset.collection = this.collectionName;

        // content
        this.buttonTitleEl.innerHTML = `${title}`;
        this.buttonContentEl.innerHTML = `${collected}/${total}`;

        // class
        const isCompleted = collected == total;
        const className = isCompleted
            ? `${CollectionCSS.button} ${CollectionCSS.buttonCompleted}`
            : `${CollectionCSS.button} `;
        this.buttonEl.className = className;
    }

    private updateListTitle(collection: IWonderCollection) {
        this.listTitleEl.innerHTML = collection.title;
    }
    private updateList(collection: IWonderCollection) {
        // clear list
        this.listContentEl.innerHTML = '';

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
        this.listContentEl.innerHTML = newList;
    }

    /********************
     *  SHOW LIST
     *******************/
    showCollection() {
        // todo
        this.listEl.className = `${CollectionCSS.list} ${CollectionCSS.listShow}`;
        if (this.onCollectionShow) this.onButtonClickCallback(this.collectionName);
    }

    closeCollection() {
        // todo
        this.listEl.className = `${CollectionCSS.list}`;
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
            console.log('getFirstLine', title);
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
