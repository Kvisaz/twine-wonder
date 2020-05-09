import {PostMessageApi} from '../twine-game/logic/PostMessageApi';
import {IWonderCollectRule} from '../twine-game/logic/collections/CollectionInterfaces';
import {RUNTIME_STORE} from '../twine-game/Stores';
import {UserScriptCommand} from './UserScriptCommands';

export class UserScriptApi {

    private readonly postMessageApi: PostMessageApi;

    constructor() {
        this.postMessageApi = new PostMessageApi();
    }

    /***********
     *  Стили, дизайн
     **********/

    /************
     *  Подключить стиль
     ***********/
    styleUrl(styleUrl: string) {
        const styleEl: HTMLElement = document.createElement('link');
        styleEl.setAttribute('rel', 'stylesheet');
        styleEl.setAttribute('href', styleUrl);
        document.head.appendChild(styleEl);
    }

    /************
     *  Подключить js
     ***********/
    jsUrl(jsUrl: string, callback: Function) {
        const script = document.createElement("script")
        script.type = "text/javascript";
        if (callback) {
            script.onload = function () {
                callback();
            };
        }
        script.src = jsUrl;
        document.head.appendChild(script);
    }

    /********************
     *  Collectibles
     *******************/

    collect(rule: IWonderCollectRule) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.collectionRule,
            data: rule
        })
    }

    /***********
     *  Sounds
     **********/

    music(url: string, volume = 1) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.music,
            data: {
                url: url,
                volume: volume
            }
        })
    }

    musicFor(hashName: string, url: string, volume = 1) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.musicFor,
            data: {
                url: url,
                volume: volume,
                hashName: hashName
            }
        })
    }

    sound(url: string, volume = 1) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.sound,
            data: {
                url: url,
                volume: volume,
            }
        })
    }

    musicStop() {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.musicStop,
            data: null
        })
    }

    /********************
     *  postMessageApi
     *******************/
    parentApi(): PostMessageApi {
        return this.postMessageApi;
    }

    /********************
     *  save/load
     *******************/
    // для отключения, если работаем с внешним API, к примеру
    disableLocalSave(disable = true) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.enableExternalApi,
            data: true
        })
    }

    enableExternalApi(disable = true) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.enableExternalApi,
            data: true
        })
    }

    hasSave(): boolean {
        return RUNTIME_STORE.hasSave;
    }

    autoLoad(enabled = true) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.autoLoad,
            data: enabled
        })
    }

    autoload = this.autoLoad;

    autoSave(enabled = true) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.autoSave,
            data: enabled
        })
    }

    autosave = this.autoSave;

    saveSlot(saveName: string) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.saveSlot,
            data: saveName
        })
    }

    save(saveName?: string) {
        if (saveName != null) this.saveSlot(saveName);
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.save,
            data: saveName
        })
    }

    load(saveName?: string) {
        if (saveName != null) this.saveSlot(saveName);
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.load,
            data: saveName
        })
    }

    /****************
     *  restart и переходы
     *********/

    /**
     * @param delay - задержка в ms
     * @param name - с какого параграфа начать
     */
    start(delay = 0, name: string = null) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.start,
            data: {
                delay: delay,
                name: name
            }
        })
    }

    /****************
     *  show text в месте вызова
     *********/

    showText(text: string) {
        // рантайм просто запихивает тексты в буффер
        // оттуда их забирает логика
        RUNTIME_STORE.textBuffer.push(text);
    }
}
