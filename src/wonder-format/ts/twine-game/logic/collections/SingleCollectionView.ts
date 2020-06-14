/**
 *  Single Collection button + view
 *
 *   1. each turn
 *      - update buttons
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
import {PASSAGE_COLLECTION_TEMPLATE, REGEXP} from '../../../Constants';
import {DomUtils} from '../../../app-core/DomUtils';
import {IKvisazLibDialogOptions, IKvisazLibrary} from 'kvisaz-dialog/src/kvisaz';

const itemSelector = '.' + CollectionCSS.listItem;
const closeButtonSelector = '.' + CollectionCSS.listCloseButton;

export class SingleCollectionView {
    private readonly buttonEl: HTMLElement;
    private buttonTitleEl: HTMLElement;
    private buttonContentEl: HTMLElement;

    private collectionName: string;
    private collection: IWonderCollection;

    private onButtonClickCallback: ICollectionShowCallback;

    constructor(
        private buttonClass = CollectionCSS.button,
    ) {
        this.buttonEl = this.createButton(buttonClass);
    }

    attach(el?: HTMLElement) {
        el = el || document.body;
        /*        document.body.appendChild(this.listEl);
                document.body.appendChild(this.pageEl);*/
        el.appendChild(this.buttonEl);
    }

    update(collection: IWonderCollection) {
        this.updateButton(collection);
        this.collection = collection;

        // this.updateListTitle(collection);
        // this.updateList(collection);
    }

    onCollectionShow(callback: ICollectionShowCallback) {
        this.onButtonClickCallback = callback;
    }

    /********************
     *  create elements
     *******************/
    private createButton(className: string): HTMLElement {
        const bt = document.createElement('button');
        bt.className = className;

        this.buttonTitleEl = this.createDiv(CollectionCSS.buttonTitle);
        this.buttonContentEl = this.createDiv(CollectionCSS.buttonContent);

        bt.appendChild(this.buttonTitleEl);
        bt.appendChild(this.buttonContentEl);

        return bt;
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

    /********************
     *  SHOW LIST
     *******************/
    showCollection() {
        console.log('ToDo showCollection....');

        // @ts-ignore
        const winOptions: IKvisazLibDialogOptions = {
            addClass: CollectionCSS.list,
            html: this.getListHtml(this.collection),
            onClick: e => this.onCollectionClick(e)
        }

        this.showKvisazWindow(winOptions);

        if (this.onCollectionShow) this.onButtonClickCallback(this.collectionName);
    }

    private onCollectionClick(e) {
        console.log('ToDo onCollectionClick....');

        // @ts-ignore
        const closeButton: HTMLElement = DomUtils.closest(e.target, closeButtonSelector);
        if (closeButton) {
            this.closeKvisazWindow(e);
        }

        // @ts-ignore
        const listItem: HTMLElement = DomUtils.closest(e.target, itemSelector);
        if (listItem) {
            const name = listItem.dataset.name;
            this.onItemClick(name);
            return;
        }

    }

    private getListHtml(collection: IWonderCollection): string {
        console.log('ToDo getListHtml....');

        const closeButton: string = this.getCloseButton();
        const listTitle: string = `<h1 class="${CollectionCSS.listTitle}">${collection.title}</h1>`
        const listHeader: string = `<div class="${CollectionCSS.listHeader}">${listTitle} ${closeButton}</div>`


        const listItems: string = this.getItemsHTML(collection);
        const listContent: string = `<div class="${CollectionCSS.listContent}">${listItems}</div>`;

        return listHeader + listContent;
    }

    private getCloseButton():string {
        return `<button class="${CollectionCSS.listCloseButton}">Закрыть</button>`;
    }

    private getItemsHTML(collection: IWonderCollection): string {
        const passageMap = STORY_STORE.story.passageHash;
        let newList = '';
        collection.collected.forEach((name) => {
            const passage = passageMap[name];
            const title = this.getPageTitle(passage.content);
            const itemTemplate = this.getItemTemplate(title, name);
            newList += itemTemplate;
        });

        return newList;
    }

    closeCollection() {
        this.closePage(); // если была открыта страница - убираем и её
    }

    /********************
     *  FIND PAGE
     *******************/

    private onItemClick(name: string) {
        const passage = STORY_STORE.story.passageHash[name];

        console.log('onItemClick', passage);


        if (passage == null) {
            console.warn('SingleCollectionView.onItemClick: cannot find' + name);
            return;
        }

        // this.updatePage(passage);
        this.showPage(passage);
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
    private showPage(passage: ITwinePassage) {
        //this.pageEl.classList.add(CollectionCSS.pageShow);

        // parse content
        // чистим контент от возможных скриптов
        const pageHTML: string = this.getPassageHTML(passage);

        // @ts-ignore
        const winOptions: IKvisazLibDialogOptions = {
            html: pageHTML,
            addClass: CollectionCSS.page,
            onClick: e => this.onPageClick(e)
        }

        this.showKvisazWindow(winOptions);
    }

    private onPageClick(e: MouseEvent) {
        this.closeKvisazWindow(e);
    }

    private getPassageHTML(passage: ITwinePassage): string {
        const cleanedContent = passage.content.replace(REGEXP.exeScript,
            '');
        return formatTwinePassageAsHTML(cleanedContent, PASSAGE_COLLECTION_TEMPLATE);
    }

    private closePage() {
        // this.pageEl.classList.remove(CollectionCSS.pageShow);
    }

    private showKvisazWindow(options: IKvisazLibDialogOptions) {
        const Kvisaz: IKvisazLibrary = window['Kvisaz'];
        Kvisaz.dialog(options);
    }

    private closeKvisazWindow(e: MouseEvent) {
        const kvisazWrapper = e.currentTarget as HTMLElement;
        const Kvisaz: IKvisazLibrary = window['Kvisaz'];
        Kvisaz.close(kvisazWrapper);
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
        return `<button class=${CollectionCSS.listItem} data-name="${name}">${title}</button>`
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
