import {PostMessageApi} from '../PostMessageApi';
import {IWonderCollectRule} from '../collections/CollectionInterfaces';
import {RUNTIME_STORE} from '../../Stores';
import {UserScriptCommand} from './UserScriptCommands';
import {IMap} from '../../../abstract/WonderInterfaces';
import {IStartScreenOptions} from '../start/StartScreenInterfaces';

export class UserScriptApi {

    private readonly postMessageApi: PostMessageApi;
    private readonly includedScripts: IMap<boolean>;
    private readonly includedStyles: IMap<boolean>;

    constructor(postMessageApi: PostMessageApi) {
        this.postMessageApi = postMessageApi;
        this.includedScripts = {};
        this.includedStyles = {};
    }

    /***********
     *  Стили, дизайн
     **********/

    /************
     *  Подключить стиль
     ***********/
    styleUrl(styleUrl: string) {
        if (this.includedStyles[styleUrl]) return;
        this.includedStyles[styleUrl] = true;

        const styleEl: HTMLElement = document.createElement('link');
        styleEl.setAttribute('rel', 'stylesheet');
        styleEl.setAttribute('href', styleUrl);
        document.head.appendChild(styleEl);
    }

    /************
     *  Подключить js
     ***********/
    jsUrl(jsUrl: string, callback: Function) {
        if (this.includedScripts[jsUrl]) return;
        this.includedScripts[jsUrl] = true;

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
            data: !disable
        })
    }

    enableExternalApi(enable = true) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.enableExternalApi,
            data: enable
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
     *  Настройка стартовой страницы
     *********/
    startPage(options: Partial<IStartScreenOptions>) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.startPage,
            data: options
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

    /**
     * обнулить gamestate
     */
    reset() {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.reset,
            data: {}
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

    /********
     *  добавить текст к странице
     */

    // добавить text/html в конец  всех страниц с тегом tag
    pageAdd(tag: string, text: string) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.pageAdd,
            data: {
                tag: tag,
                text: text
            }
        })
    }

    // добавить text/html в начало  всех страниц с тегом tag
    pageBefore(tag: string, text: string) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.pageBefore,
            data: {
                tag: tag,
                text: text
            }
        })
    }

    // добавить text/html вокруг  всех страниц с тегом tag
    pageWrap(tag: string, text: string, text2: string) {
        RUNTIME_STORE.commands.push({
            name: UserScriptCommand.pageWrap,
            data: {
                tag: tag,
                text: text,
                text2: text2
            }
        })
    }
}
