import {IMessageCallback, ILoadCallback} from '../../../abstract/WonderInterfaces';
import {IStateRepository} from './StateRepositoryInterfaces';
import {LocalRepository} from './LocalRepository';
import {PostMessageRepository} from './PostMessageRepository';

export class StateRepository implements IStateRepository {
    private readonly localRepo: IStateRepository;
    private readonly postMessageRepo: IStateRepository;
    private repo: IStateRepository;

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
        this.repo.load(saveName,resolve, reject);
    }

    save(saveName: string, data: any, resolve: IMessageCallback, reject: IMessageCallback) {
        console.log('repo save....', saveName, data);
        this.repo.save(saveName,data, resolve, reject);
    }
}
