import {ITwinePassage} from '../../abstract/TwineModels';
import {WonderButtonCommand} from './LogicConstants';

export interface IPassagePreparedCallback {
    (passage: ITwinePassage): void
}


export interface IWonderButtonData {
    command: WonderButtonCommand;
    name?:string; // passage name
    delay?:string; // задержка
}
