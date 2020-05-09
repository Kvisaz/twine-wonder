import {IMessageCallback, ILoadCallback} from '../../../abstract/WonderInterfaces';

export interface IStateRepository {
    save(saveName: string, data: string, resolve: IMessageCallback, reject: IMessageCallback);

    load(saveName: string, resolve: ILoadCallback, reject: IMessageCallback);
}
