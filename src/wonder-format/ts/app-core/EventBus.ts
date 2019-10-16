import {Task} from "./Task";
import {ArrayUtils} from "./ArrayUtils";

/***
 *  Использование
 *  подписаться на сообщения
 *  EventBus
 *      .sub("messageType1", (message, data)=>{})
 *      .sub("messageType2", (message, data)=>{})
 *      .sub("messageType3", (message, data)=>{});
 *
 *  сообщить
 *  EventBus.emit("messageType1", data?:any);
 *
 *  для использования в конкретных играх - уместно объявить класс-потомкс уникальным именем
 *  типа MyGameEvents
 *  и использовать именно MyGameEvents
 */

export class EventBus {
    private listeners: IEventListeners;

    private static instance: EventBus;

    protected constructor() {
        this.listeners = {};
    }

    getListeners(message: string): Array<IEventListener> {
        return this.listeners[message];
    }

    initListeners(message: string): Array<IEventListener> {
        this.listeners[message] = [];
        return this.listeners[message];
    }

    static getInstance(): EventBus {
        if (EventBus.instance == null) EventBus.instance = new EventBus();
        return EventBus.instance;
    }

    static addListener(message: string, listener: IEventListener) {
        const listeners = EventBus.getInstance().getListeners(message)
            || EventBus.getInstance().initListeners(message);
        listeners.push(listener);
    }

    sub(message: string, listener: IEventListener): EventBus {
        const listeners = this.getListeners(message) || this.initListeners(message);
        listeners.push(listener);
        return this;
    }

    unsub(message: string, listener: IEventListener): EventBus {
        const listeners = this.getListeners(message);
        if (listeners == null) return;
        ArrayUtils.removeChild(listeners, listener);
        return this;
    }

    static emit(message: string, data?: any) {
        const listeners = EventBus.getInstance().getListeners(message);
        if (listeners) listeners.forEach(listener => {
            /**
             * каждый листенер исполняется в свою очередь в EventLoop
             * - поэтому ошибка в одном листенере не будет ломать стек с другими
             *  - поэтому ошибка 1 листенера не будет ломать остальные
             */
            Task.order(() => {
                listener(message, data);
            })
        });
    }
}

export interface IEventListeners {
    [message: string]: Array<IEventListener>;
}

export interface IEventListener {
    (message: string, data?: any): void;
}