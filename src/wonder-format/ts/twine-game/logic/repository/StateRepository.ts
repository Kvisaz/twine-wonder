import {IMessageCallback, ILoadCallback} from '../../../abstract/WonderInterfaces';
import {IStateRepository} from './StateRepositoryInterfaces';
import {LocalRepository} from './LocalRepository';
import {PostMessageRepository} from './PostMessageRepository';

export class StateRepository implements IStateRepository {
    private readonly localRepo: IStateRepository;
    private readonly postMessageRepo: IStateRepository;
    private repo: IStateRepository;

    // защита от циклических перезагрузок и перезаписей
    private loadTimes = {};
    private saveTimes = {};
    private operationDelta = 150;

    constructor() {
        this.localRepo = new LocalRepository();
        this.postMessageRepo = new PostMessageRepository();
        this.repo = this.localRepo;
    }

    enableExternalApi(enable: boolean) {
        this.repo = enable ? this.postMessageRepo : this.localRepo;
    }

    load(saveName: string, resolve: ILoadCallback, reject: IMessageCallback) {
        console.log('repo load....');

        const now = Date.now();
        const lastTime = this.loadTimes[saveName] || 0;
        if (now - lastTime < this.operationDelta) {
            console.warn('too much loading...');
            return;
        }
        this.loadTimes[saveName] = now;

        this.repo.load(saveName, resolve, reject);
    }

    save(saveName: string, data: any, resolve: IMessageCallback, reject: IMessageCallback) {
        console.log('repo save....', saveName, data);

        const now = Date.now();
        const lastTime = this.saveTimes[saveName] || 0;
        if (now - lastTime < this.operationDelta) {
            console.warn('too much saving...');
            return;
        }
        this.saveTimes[saveName] = now;

        this.repo.save(saveName, data, resolve, reject);
    }
}
