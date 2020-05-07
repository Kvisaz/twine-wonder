import {IMessageCallback, IStateCallback} from '../../abstract/WonderInterfaces';
import {AppState} from '../AppState';

export interface IStateRepository {
    saveName(slotName: string, resolve: IMessageCallback, reject: IMessageCallback);

    save(state: AppState, resolve: IMessageCallback, reject: IMessageCallback);

    load(resolve: IStateCallback, reject: IMessageCallback);
}
