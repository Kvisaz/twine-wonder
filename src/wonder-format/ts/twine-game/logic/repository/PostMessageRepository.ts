import {IStateRepository} from './StateRepositoryInterfaces';
import {IMap, IMessageCallback, ILoadCallback} from '../../../abstract/WonderInterfaces';
import {IPostMessage, PostMessageApi} from '../PostMessageApi';
import {PostMessages} from '../../PostMessages';

export class PostMessageRepository implements IStateRepository {
    private readonly postMessageApi: PostMessageApi;
    private readonly callbacks: IMap<Function>;

    constructor() {
        this.postMessageApi = new PostMessageApi();
        this.callbacks = {};
        this.setHandlers();
    }

    save(saveName: string, state: any, resolve: IMessageCallback, reject: IMessageCallback) {
        try {
            const json = JSON.stringify(state);
            this.callbacks[PostMessages.save] = resolve;
            this.callbacks[PostMessages.saveError] = reject;
            this.postMessageApi.send(PostMessages.save, {
                saveName: saveName,
                data: json
            });
        } catch (e) {
            reject(`postMessageRepository save Error for slotName [${saveName} :: ` + e);
        }
    }

    load(saveName: string, resolve: ILoadCallback, reject: IMessageCallback) {
        this.callbacks[PostMessages.load] = resolve;
        this.callbacks[PostMessages.loadError] = reject;
        this.postMessageApi.send(PostMessages.load, {
            saveName: saveName
        });
    }

    private setHandlers() {
        this.setMessageHandler(PostMessages.save);
        this.setMessageHandler(PostMessages.saveError);
        this.setMessageHandler(PostMessages.loadError);
        this.postMessageApi.on(PostMessages.load,
            (postMessage: IPostMessage) => this.onPostMessageLoad(postMessage));

    }

    private setMessageHandler(messageName: PostMessages) {
        this.postMessageApi.on(messageName, (postMessage: IPostMessage) => {
            const message = postMessage.data || '';
            this.callbacks[messageName](`PostMessages.${messageName} :: ${message}`)
        });
    }

    private onPostMessageLoad(postMessage: IPostMessage) {
        try {
            const state = JSON.parse(postMessage.data);
            const resolve = this.callbacks[PostMessages.load];
            resolve(state);
        } catch (e) {
            const messageName = PostMessages.loadError;
            const reject = this.callbacks[messageName];
            reject(`PostMessages.${messageName} :: ${e}`);
        }
    }
}
