import {IStateRepository} from './StateRepositoryInterfaces';
import {IMessageCallback, IStateCallback} from '../../abstract/WonderInterfaces';
import {AppState} from '../AppState';

export class LocalRepository implements IStateRepository {
    private localPrefix = 'wonder_';
    private slotName: string;


    saveName(slotName: string, resolve: IMessageCallback, reject: IMessageCallback) {
        this.slotName = slotName;
        resolve('success');
    }

    save(state: AppState, resolve: IMessageCallback, reject: IMessageCallback) {
        try {
            const json = JSON.stringify(state);
            localStorage.setItem(this.getKey(), json);
            resolve('success')
        } catch (e) {
            reject(`localRepository saveError for key [${this.getKey()}] :: ` + e);
        }
    }

    load(resolve: IStateCallback, reject: IMessageCallback) {
        console.log('local load...');
        try {
            console.log('local try...');
            const key = this.getKey();
            const json = localStorage.getItem(key);
            const state = JSON.parse(json) as AppState;
            resolve(state)
        } catch (e) {
            console.log('local catch...');
            reject(`localRepository loadError for key [${this.getKey()}] :: ` + e);
        }
    }

    private getKey(): string {
        return this.localPrefix + '_' + this.slotName;
    }

}
