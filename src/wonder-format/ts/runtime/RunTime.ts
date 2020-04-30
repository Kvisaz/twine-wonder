import {ITwinePassage, ITwineStory} from '../abstract/TwineModels';
import {PostMessageApi} from './PostMessageApi';
import {IAppState} from '../twine-game/AppState';
import {Collections, IWonderCollectRule} from './Collections';
import {AudioPlayer} from './AudioPlayer';
import {IRunTimeState} from './IRunTimeState';

export class RunTime {
    private readonly audioPlayer: AudioPlayer;
    private readonly collections: Collections;
    private readonly postMessageApi: PostMessageApi;

    private gameVars: object;

    constructor() {
        this.gameVars = {};

        this.audioPlayer = new AudioPlayer();
        this.collections = new Collections();
        this.postMessageApi = new PostMessageApi();
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
    onStoryReady(story: ITwineStory) {
        console.log('Wonder onStoryReady');
        // поскольку подсчет коллекций может быть долгим, откладываем ненадолго
        setTimeout(() => {
            this.collections.onStoryReady(story);
        }, 0);

    }

    onPassage(passage: ITwinePassage, state: IAppState) {
        this.audioPlayer.musicCheck(passage.name);
        this.collections.onPassage(passage);
    }
}
