import {ITwinePassage, ITwineStory} from '../abstract/TwineModels';
import {PostMessageApi} from './PostMessageApi';
import {IAppState} from '../twine-game/AppState';
import {Collections} from './collections/Collections';
import {AudioPlayer} from './AudioPlayer';
import {IRunTimeState} from './RunTimeInterfaces';
import {IWonderCollectRule} from './collections/CollectionInterfaces';
import {SaveApi} from './saveapi/SaveApi';

export class RunTime {
    private readonly audioPlayer: AudioPlayer;
    private readonly collections: Collections;
    private readonly postMessageApi: PostMessageApi;
    private readonly saveApi: SaveApi;


    private story: ITwineStory;

    private gameVars: object;

    constructor() {
        this.gameVars = {};

        this.audioPlayer = new AudioPlayer();
        this.collections = new Collections();
        this.postMessageApi = new PostMessageApi();
        this.saveApi = new SaveApi();
    }

    getGameVars(): object {
        return this.gameVars;
    }

    setGameVars(gameVars: object) {
        this.gameVars = {
            ...gameVars
        }
    }

    /**************
     *  STATE MANAGEMENT
     *************/


    /**************
     *  SAVE/LOAD
     *************/
    autoSave(saveName = 'autoSave') {
        this.saveApi.autoSave(saveName);
    }

    save(saveName: string = 'save_1') {
        this.saveApi.save(saveName);
    }

    load(saveName: string = 'save_1') {
        this.saveApi.load(saveName);
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
     *  todo - не работает после экспорта, стиль не грузится
     ***********/
    styleUrl(styleUrl: string) {
        const styleEl: HTMLElement = document.createElement('link');
        styleEl.setAttribute('rel', 'stylesheet');
        styleEl.setAttribute('href', styleUrl);
        document.head.appendChild(styleEl);
    }

    /********************
     *  Collectibles
     *******************/

    collect(rule: IWonderCollectRule) {
        this.collections.addRule(rule);
    }

    //HOW TO SHOW COLLECTIONS
    showCollections() {
        //  this.collections.show();
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
