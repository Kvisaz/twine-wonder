import {IWonderButtonData} from '../../LogicInterfaces';

export interface IGameMenuOptions {
    mainButtonLabel: string; // надпись на кнопке вызова
    winTitle: string; // надпись в экране, в h1, если есть
    buttons: Array<IWonderButtonData>,
    buttonHandler: IInnerGameMenuButtonCallback
}

export interface IInnerGameMenuButtonCallback {
    (dataset: IWonderButtonData): void;
}
