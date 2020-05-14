import {IWonderButtonData} from '../../LogicInterfaces';
import {WonderButtonCommand} from '../../LogicConstants';

export const MenuGameButtonLabel = 'Настройки';
export const MenuGamTitleLabel = 'Настройки';

export const BrowserMenuButtons: Array<IWonderButtonData> = [
    {
        command: WonderButtonCommand.restart,
        label: 'Новая игра',
        hint: 'Начать с первой локации'
    }
]

export const DesktopMenuButtons: Array<IWonderButtonData> = [
    {
        command: WonderButtonCommand.close,
        label: 'Закрыть игру',
        hint: 'Alt + F4 : Выйти'
    },
    {
        command: WonderButtonCommand.fullScreen,
        label: 'Полный экран/окно',
        hint: 'F11: Переключить'
    },
    ...BrowserMenuButtons,

]
