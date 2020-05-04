/***
 *  Store for State
 *  - подписка на объекты, не функции
 *  - при обновлении store - временно исключает рассылающего из получателей
 *  - обновляем только если параметры изменились
 *  - можно подписываться на любое изменение AppState
 *  - при обновлении получаешь список измененных свойств
 *  - повторные добавления того же листенера не работают
 */
export class SuperStore<T extends IAppState> {
    private readonly state: T;
    private readonly listeners: Array<ISuperStoreListener<T>>;

    get: T;

    constructor(appState: T) {
        this.state = appState;
        this.listeners = [];

        this.get = new Proxy(appState, {
            set(target, prop, val) {
                console.warn('Store.get[key] is read-only')
                return false;
            }
        })
    }

    update(props: Partial<T>, fromListener: ISuperStoreListener<T>) {
        const propNames = Object.keys(props);
        console.log('SuperStore update start -> ', propNames.join(', '));
        let changedProps = {};
        let isChanged = false;
        // обновляем пропы
        propNames.forEach(propName => {
            let newProp = props[propName];
            if (this.state[propName] != newProp) {
                // @ts-ignore
                this.state[propName] = newProp;
                changedProps[propName] = newProp;
                isChanged = true;
            }
        });

        // делаем рассылки только если состояние изменилось
        console.log('SuperStore update isChanged -> ', isChanged);
        if (!isChanged) return;

        // рассылаем  изменения c указанием, что изменилось - пусть сами ловят
        this.sendState(fromListener, this.listeners, changedProps);
    }


    subscribe(listener: ISuperStoreListener<T>) {
        this.addListener(listener, this.listeners);
    }

    unsubscribe(listener: ISuperStoreListener<T>) {
        this.removeFrom(listener, this.listeners);
    }

    private removeFrom(listener: ISuperStoreListener<T>, listeners: Array<ISuperStoreListener<T>>) {
        const index = listeners.indexOf(listener);
        if (index < 0) return;
        this.listeners.splice(index, 1);
    }

    private addListener(listener: ISuperStoreListener<T>, listeners: Array<ISuperStoreListener<T>>) {
        // повторные добавления того же листенера не работают
        this.removeFrom(listener, listeners);
        listeners.push(listener);
    }

    private sendState(fromListener: ISuperStoreListener<T>, listeners: Array<ISuperStoreListener<T>>, props: Partial<T>) {
        listeners.forEach(listener => {
            const notSameListener = listener != fromListener;
            if (notSameListener) {
                listener.onStateChange(props, this.state)
            }
        });
    }
}

export interface ISuperStoreListener<T extends IAppState> {
    onStateChange(props: Partial<T>, state: T): void;
}


interface IAppState{
    [key: string]: any
}
