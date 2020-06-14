import {GameMenuCSS} from './GameMenuCSS';
import {IGameMenuOptions} from './GameMenuInterfaces';
import {IKvisazLibDialogOptions, IKvisazLibrary} from 'kvisaz-dialog/src/kvisaz';
import {IcSvgSettings} from '../../../ConstantsSvg';
import {DomUtils} from '../../../app-core/DomUtils';
import {GAME_MENU_BUTTON_TEMPLATE} from '../../../Constants';
import {SideBarView} from '../../SideBarView';

export class GameMenu {
    private readonly buttonEl: HTMLElement;
    private windowOptions: IKvisazLibDialogOptions;

    constructor() {
        console.log('GameMenu constructor....');
        this.buttonEl = this.createButton(GameMenuCSS.mainButtonClass);
        this.buttonEl.addEventListener('click', e => this.onMainButtonClick(e))

        const sideBarElement = SideBarView.getSideBar1();
        sideBarElement.appendChild(this.buttonEl);
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
    private createButton(className: string): HTMLElement {
        const el = <HTMLElement>DomUtils.elementFromTemplate(GAME_MENU_BUTTON_TEMPLATE);
        el.className = className;
        el.innerHTML = IcSvgSettings;
        const BUTTON_LABEL = "Меню игры";
        el.setAttribute('aria-label', BUTTON_LABEL)
        el.setAttribute('title', BUTTON_LABEL)
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
