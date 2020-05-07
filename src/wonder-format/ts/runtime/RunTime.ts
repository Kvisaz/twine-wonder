import {ITwinePassage} from '../abstract/TwineModels';
import {PostMessageApi} from './PostMessageApi';
import {IAppState} from '../twine-game/AppState';
import {Collections} from './collections/Collections';
import {AudioPlayer} from './AudioPlayer';
import {IWonderCollectRule} from './collections/CollectionInterfaces';
import {RUNTIME_STORE} from '../twine-game/Stores';
import {RunTimeCommand} from './RunTimeCommands';

export class RunTime {
    private readonly audioPlayer: AudioPlayer;
    private readonly collections: Collections;
    private readonly postMessageApi: PostMessageApi;

    constructor() {
        this.audioPlayer = new AudioPlayer();
        this.collections = new Collections();
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
        this.collections.addRule(rule);
    }

    /***********
     *  Sounds
     **********/

    music(url: string, volume = 1) {
        this.audioPlayer.music(url, volume);
    }

    musicFor(hashName: string, url: string, volume = 1) {
        this.audioPlayer.musicFor(hashName, url, volume);
    }

    sound(url: string, volume = 1) {
        this.audioPlayer.sound(url, volume);
    }

    musicStop() {
        this.audioPlayer.stop();
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
            name: RunTimeCommand.enableExternalApi,
            data: true
        })
    }

    enableExternalApi(disable = true) {
        RUNTIME_STORE.commands.push({
            name: RunTimeCommand.enableExternalApi,
            data: true
        })
    }

    autoSave(enabled = true) {
        RUNTIME_STORE.commands.push({
            name: RunTimeCommand.autoSave,
            data: enabled
        })
    }

    autosave = this.autoSave;

    saveSlot(saveName: string) {
        RUNTIME_STORE.commands.push({
            name: RunTimeCommand.saveSlot,
            data: saveName
        })
    }

    save(saveName?: string) {
        if (saveName != null) this.saveSlot(saveName);
        RUNTIME_STORE.commands.push({
            name: RunTimeCommand.save,
            data: saveName
        })
    }

    load(saveName?: string) {
        if (saveName != null) this.saveSlot(saveName);
        RUNTIME_STORE.commands.push({
            name: RunTimeCommand.load,
            data: saveName
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

    /***********
     *  методы вызываются основным движком
     **********/
    onStoryReady() {
        console.log('Wonder onStoryReady');
        // поскольку подсчет коллекций может быть долгим, откладываем ненадолго
        setTimeout(() => {
            this.collections.onStoryReady();
        }, 0);
    }

    onPassage(passage: ITwinePassage, state: IAppState) {
        this.audioPlayer.musicCheck(passage.name);
        this.collections.onPassage(passage);
    }
}
