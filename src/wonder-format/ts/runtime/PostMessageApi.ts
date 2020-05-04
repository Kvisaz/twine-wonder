export class PostMessageApi {
    private readonly parent: Window;
    private readonly targetOrigin: string;
    private readonly listenerMap: IMessageListenerHash;

    private isDisabled = true;

    constructor(parent = null, targetOrigin = "*") {
        this.listenerMap = {};
        this.parent = parent;
        if (this.parent == null) {
            this.parent = window.parent;
        }

        this.targetOrigin = targetOrigin;
        window.addEventListener('message', e => this.onMessage(e));

    }

    enable() {
        this.isDisabled = false;
    }

    disable() {
        this.isDisabled = true;
    }

    send(messageName: string, data?: any) {
        if (this.isDisabled) return;

        const postMessage: IPostMessage = {
            name: messageName,
            data: data
        }
        if (this.parent) {
            this.parent.postMessage(postMessage, this.targetOrigin);
        } else {
            console.warn('PostMessageAPI.send:  no window parent')
        }
    }

    on(messageName: string, listener: IPostMessageListener) {
        if (this.isDisabled) return;

        if (this.listenerMap[messageName] == null) {
            this.listenerMap[messageName] = [];
        }
        this.listenerMap[messageName].push(listener);
    }

    private onMessage(e: MessageEvent) {
        const postMessage: Partial<IPostMessage> = e.data;
        const listeners = this.listenerMap[postMessage.name];
        if (listeners) {
            listeners.forEach(listener => listener(postMessage.data));
        } else {
            console.warn('PostMessageAPI.onMessage:  no listeners for', postMessage.name);
            console.warn('MessageEvent: ', e);
        }
    }
}

export interface IPostMessage {
    name: string,
    data: any
}

export interface IPostMessageListener {
    (data: any): void;
}

interface IMessageListenerHash {
    [eventName: string]: Array<IPostMessageListener>;
}
