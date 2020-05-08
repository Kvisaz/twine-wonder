import {IMessageCallback, IStateCallback} from '../../../abstract/WonderInterfaces';
import {AppState} from '../../AppState';
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

    saveName(slotName: string, resolve: IMessageCallback, reject: IMessageCallback) {
        console.log('repo saveName....', slotName);
        this.repo.saveName(slotName, resolve, reject);
    }

    load(resolve: IStateCallback, reject: IMessageCallback) {
        console.log('repo load....');
        this.repo.load(resolve, reject);
    }

    save(state: AppState, resolve: IMessageCallback, reject: IMessageCallback) {
        console.log('repo save....');
        this.repo.save(state, resolve, reject);
    }
}
