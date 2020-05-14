import {WONDER} from '../../../../Constants';
import {GameMenuCSS} from './GameMenuCSS';
import {IGameMenuOptions} from './GameMenuInterfaces';
import {IWonderButtonData} from '../../LogicInterfaces';
import {IcSvgSettings} from '../../../../ConstantsSvg';

export class GameMenu {
    private readonly buttonEl: HTMLElement;
    private readonly shadowEl: HTMLElement;
    private readonly winEl: HTMLElement;

    private parent: HTMLElement;

    constructor() {
        console.log('GameMenu constructor....');
        this.parent = document.body;
        this.buttonEl = this.createButton(GameMenuCSS.mainButtonClass);
        this.parent.appendChild(this.buttonEl);
        this.shadowEl = this.createShadow(WONDER.shadowScreenClass);
        this.winEl = this.createWin(GameMenuCSS.winClass);
    }

    setup(options: IGameMenuOptions) {
        console.log('GameMenu setup....');
        this.update(options);


        this.showMainButton();
    }

    /********************
     *  create elements
     *******************/
    private createDiv(className: string): HTMLElement {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }

    private createButton(className: string): HTMLElement {
        const div = this.createDiv(className);
        div.innerHTML = IcSvgSettings;
        return div;
    }

    private createShadow(className: string) {
        const el = document.createElement('div');
        el.id = GameMenuCSS.shadowId;
        el.className = className;
        return el;
    }

    private createWin(className: string) {
        const el = document.createElement('div');
        el.id = GameMenuCSS.winId;
        el.className = className;
        return el;
    }

    /********************
     *  visibility
     *******************/
    private showElement(el: HTMLElement, visible = true) {
        el.style.display = visible ? 'block' : 'none';
    }

    private showMainButton() {
        this.buttonEl.classList.add(GameMenuCSS.mainButtonVisibleClass);
    }

    private showShadow() {
        this.showElement(this.shadowEl, true);
    }

    private hideShadow() {
        this.showElement(this.shadowEl, false);
    }

    private showWindow() {
        this.shadowEl.classList.add(GameMenuCSS.winVisibleClass);
    }

    private hideWindow() {
        this.shadowEl.classList.remove(GameMenuCSS.winVisibleClass);
    }

    /********************
     *  update elements
     *******************/
    private update(options: IGameMenuOptions) {
        this.updateButton(options);
        this.updateWindow(options);
    }

    private updateButton(options: IGameMenuOptions) {
        //this.buttonEl.innerHTML = options.mainButtonLabel;
    }

    private updateWindow(options: IGameMenuOptions) {
        const title: string = `<h1>${options.winTitle}</h1>`;

        const buttonCode: string = options.buttons
            .map(bt => this.createWinButton(bt))
            .join('\n');

        const winContentCode = `<div class="${GameMenuCSS.winContentClass}">${title}
${buttonCode}
</div>`;

        this.winEl.innerHTML = winContentCode;
    }

    /********************
     * templates
     *******************/
    private createWinButton(bt: IWonderButtonData): string {
        const dataAttrsCode: string = Object.keys(bt).map(key => this.createDataAttr(key, bt[key])).join(' ');

        return `<div class=${GameMenuCSS.winButtonClass} ${dataAttrsCode}>${bt.label}</div>`;
    }

    private createDataAttr(name: string, value: string): string {
        if (name == null || name == 'callback') return '';
        else return `data-${name} = "${value}"`;
    }

    /********************
     *
     *******************/


}
