import {GameMenuCSS} from './GameMenuCSS';
import {IGameMenuOptions} from './GameMenuInterfaces';
import {IcSvgSettings} from '../../../../ConstantsSvg';
import {IKvisazLibDialogOptions, IKvisazLibrary} from 'kvisaz-dialog/src/kvisaz';

export class GameMenu {
    private readonly buttonEl: HTMLElement;
    private parent: HTMLElement;
    private windowOptions: IKvisazLibDialogOptions;

    constructor() {
        console.log('GameMenu constructor....');
        this.parent = document.body;
        this.buttonEl = this.createButton(GameMenuCSS.mainButtonClass);
        this.buttonEl.addEventListener('click', e => this.onMainButtonClick(e))
        this.parent.appendChild(this.buttonEl);
    }

    setup(options: IGameMenuOptions) {
        console.log('GameMenu setup....');
        this.windowOptions = options.windowOptions;
        this.showMainButton();
    }

    /********************
     *  click
     *******************/
    private onMainButtonClick(e: MouseEvent) {
        const Kvisaz:IKvisazLibrary = window['Kvisaz'];
        Kvisaz.dialog(this.windowOptions);
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
        const el = this.createDiv(className);
        el.innerHTML = IcSvgSettings;
        return el;
    }

    /********************
     *  visibility
     *******************/
    private showMainButton() {
        this.buttonEl.classList.add(GameMenuCSS.mainButtonVisibleClass);
    }

    /********************
     *  update elements
     *******************/

    /********************
     *
     *******************/

}
