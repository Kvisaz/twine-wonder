import {IStateRepository} from './StateRepositoryInterfaces';
import {IMap, IMessageCallback, IStateCallback} from '../../abstract/WonderInterfaces';
import {AppState, IAppState} from '../AppState';
import {IPostMessage, PostMessageApi} from '../../runtime/PostMessageApi';
import {PostMessages} from '../PostMessages';

export class PostMessageRepository implements IStateRepository {
    private slotName: string;
    private readonly postMessageApi: PostMessageApi;
    private readonly callbacks: IMap<Function>;

    constructor() {
        this.postMessageApi = new PostMessageApi();
        this.callbacks = {};

        this.setHandlers();
    }

    saveName(slotName: string, resolve: IMessageCallback, reject: IMessageCallback) {
        this.callbacks[PostMessages.saveSlot] = resolve;
        this.callbacks[PostMessages.saveSlotError] = reject;
        this.postMessageApi.send(PostMessages.save, slotName);
        this.slotName = slotName;
    }

    save(state: AppState, resolve: IMessageCallback, reject: IMessageCallback) {
        try {
            const json = JSON.stringify(state);
            this.callbacks[PostMessages.save] = resolve;
            this.callbacks[PostMessages.saveError] = reject;
            this.postMessageApi.send(PostMessages.save, json);
        } catch (e) {
            reject(`postMessageRepository save Error for slotName [${this.slotName} :: ` + e);
        }
    }

    load(resolve: IStateCallback, reject: IMessageCallback) {
        this.callbacks[PostMessages.load] = resolve;
        this.callbacks[PostMessages.loadError] = reject;
        this.postMessageApi.send(PostMessages.load, null);
    }

    private setHandlers() {

        this.setMessageHandler(PostMessages.saveSlot);
        this.setMessageHandler(PostMessages.saveSlotError);
        this.setMessageHandler(PostMessages.save);
        this.setMessageHandler(PostMessages.saveError);
        this.setMessageHandler(PostMessages.loadError);


        this.postMessageApi.on(PostMessages.load, (postMessage: IPostMessage) => {
            this.onPostMessageLoad(postMessage);
        });

    }

    private setMessageHandler(messageName: PostMessages) {
        this.postMessageApi.on(messageName, (postMessage: IPostMessage) => {
            const message = postMessage.data || '';
            this.callbacks[messageName](`PostMessages.${messageName} :: ${message}`)
        });
    }

    private onPostMessageLoad(postMessage: IPostMessage) {
        try {
            const state = JSON.parse(postMessage.data) as IAppState;
            const resolve = this.callbacks[PostMessages.load];
            resolve(state);
        } catch (e) {
            const messageName = PostMessages.loadError;
            const reject = this.callbacks[messageName];
            reject(`PostMessages.${messageName} :: ${e}`);
        }
    }
}
