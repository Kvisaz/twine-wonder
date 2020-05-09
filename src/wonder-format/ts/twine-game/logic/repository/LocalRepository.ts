import {IStateRepository} from './StateRepositoryInterfaces';
import {ILoadCallback, IMessageCallback} from '../../../abstract/WonderInterfaces';

export class LocalRepository implements IStateRepository {

    save(saveName: string, state: any, resolve: IMessageCallback, reject: IMessageCallback) {
        try {
            const json = JSON.stringify(state);
            localStorage.setItem(saveName, json);
            resolve('success')
        } catch (e) {
            reject(`localRepository saveError for key [${saveName}] :: ` + e);
        }
    }

    load(saveName: string, resolve: ILoadCallback, reject: IMessageCallback) {
        console.log('local load...');
        try {
            console.log('local try...');
            const json = localStorage.getItem(saveName);
            const state = JSON.parse(json);
            resolve(state)
        } catch (e) {
            console.log('local catch...');
            reject(`localRepository loadError for key [${saveName}] :: ` + e);
        }
    }
}
