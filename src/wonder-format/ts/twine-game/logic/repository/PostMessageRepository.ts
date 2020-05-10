import {IStateRepository} from './StateRepositoryInterfaces';
import {ILoadCallback, IMap, IMessageCallback} from '../../../abstract/WonderInterfaces';
import {IPostLoadMessage, PostMessageApi} from '../PostMessageApi';
import {PostMessages} from '../../PostMessages';

export class PostMessageRepository implements IStateRepository {
    private readonly postMessageApi: PostMessageApi;
    private readonly callbacks: IMap<Function>;

    constructor(postMessageApi: PostMessageApi) {
        this.postMessageApi = postMessageApi;
        this.callbacks = {};
        this.setHandlers();
    }

    save(saveName: string, data: any, resolve: IMessageCallback, reject: IMessageCallback) {
        console.log('postMessage repo save....', saveName, data);
        try {
            const json = JSON.stringify(data);
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
        console.log('postMessage repo load....', saveName);
        this.callbacks[PostMessages.load] = resolve;
        this.callbacks[PostMessages.loadError] = reject;
        console.log('callbacks....', this.callbacks);
        this.postMessageApi.send(PostMessages.load, {
            saveName: saveName
        });
    }

    private setHandlers() {
        this.setMessageHandler(PostMessages.save);
        this.setMessageHandler(PostMessages.saveError);
        this.setMessageHandler(PostMessages.loadError);
        this.postMessageApi.on(PostMessages.load,
            (loadMessage: IPostLoadMessage) => this.onLoad(loadMessage));

    }

    private setMessageHandler(messageName: PostMessages) {
        this.postMessageApi.on(messageName, data => {
            console.log(' this.postMessageApi.on ', messageName, data)
            const message = data.saveName + ' ' + data.data;
            this.callbacks[messageName](`PostMessages.${messageName} :: ${message}`)
        });
    }

    private onLoad(loadMessage: IPostLoadMessage) {
        const saveName = loadMessage.saveName;
        const data = loadMessage.data;

        console.log('onPostMessageLoad....', this.callbacks);
        console.log(' onPostMessageLoad ', saveName, data);

        try {
            const resolve = this.callbacks[PostMessages.load];
            const reject = this.callbacks[PostMessages.loadError];
            if (data == null) {
                reject(`PostMessages.loadError :: null save for ${saveName}`);
            } else {
                const state = JSON.parse(data);
                resolve(state);
            }
        } catch (e) {
            const messageName = PostMessages.loadError;
            const reject = this.callbacks[messageName];
            reject(`PostMessages.${messageName} :: ${e}  for ${saveName}`);
        }
    }
}
