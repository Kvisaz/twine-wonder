import {ITwinePassage} from '../abstract/TwineModels';
import {PostMessageApi} from './PostMessageApi';
import {IAppState} from '../twine-game/AppState';
import {Collections} from './collections/Collections';
import {AudioPlayer} from './AudioPlayer';
import {IRunTimeState} from './IRunTimeState';
import {IWonderCollectRule} from './collections/CollectionInterfaces';
import {ISaveApiAppDataHandler} from './saveapi/SaveApiInterfaces';
import {SaveApi} from './saveapi/SaveApi';
import {STORE} from '../twine-game/Stores';
import {AppEvents} from '../twine-game/AppEvents';

export class RunTime {
    private readonly audioPlayer: AudioPlayer;
    private readonly collections: Collections;
    private readonly postMessageApi: PostMessageApi;
    private readonly saveApi: SaveApi;

    private gameVars: object;

    constructor() {
        this.gameVars = {};

        this.audioPlayer = new AudioPlayer();
        this.collections = new Collections();
        this.postMessageApi = new PostMessageApi();
        this.saveApi = new SaveApi();

        // enable parent API load if enabled
        this.postMessageApi.on(AppEvents.load,
            (state: IAppState) => {
                this.saveApi.loadFrom(state)
            });

        // set saveApi data source
        this.saveApi.dataGetter = () => {
            console.log('get STORE.state ', STORE.state)
            return STORE.state;
        }
    }

    onStateLoad(listener: ISaveApiAppDataHandler) {
        this.saveApi.dataHandler = listener;
    }

    getGameVars(): object {
        return this.gameVars;
    }

    setGameVars(gameVars: object) {
        this.gameVars = {
            ...gameVars
        }
    }

    updateGameVars(gameVars: object) {
        this.gameVars = {
            ...this.gameVars,
            ...gameVars
        }
    }

    /**************
     *  STATE
     *************/
    setState(state: IRunTimeState) {
        if (state == null) return;
        this.setGameVars(state.gameVars);
        this.collections.loadState(state.collections);
    }

    getState(): IRunTimeState {
        return {
            gameVars: this.gameVars,
            collections: this.collections.getState()
        }
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
        this.saveApi.disable(disable);
    }

    autoSave(enabled = true) {
        this.saveApi.autoSave(enabled);
    }

    autosave = this.autoSave;

    saveSlot(saveName: string) {
        this.saveApi.saveSlot(saveName);
    }

    save(saveName?: string) {
        this.parentApi().send(AppEvents.passage, STORE.state);
        this.saveApi.save(saveName);
    }

    load(saveName?: string) {
        this.saveApi.load(saveName);
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
        this.saveApi.onPassage();
    }
}
