import {ITwinePassage} from '../../abstract/TwineModels';

export interface IPassagePreparedCallback {
    (passage: ITwinePassage): void
}
