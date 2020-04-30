import {ITwinePassage, ITwineStory} from '../abstract/TwineModels';
import {PostMessageApi} from './PostMessageApi';
import {IAppState} from '../twine-game/AppState';

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

/*************
 *  Audio
 ***********/
class AudioPlayer {
    private audioElement: HTMLAudioElement;
    private lastUrl: string;

    private musicHash: ISoundHash; // список урлов для локаций

    constructor() {
        this.musicHash = {};
        this.audioElement = new Audio();
    }

    music(url: string, volume) {
        this.audioElement.loop = true;
        this.play(url, volume);
    }

    sound(url: string, volume) {
        this.audioElement.loop = false;
        this.play(url, volume);
    }

    musicFor(hashName: string, url: string, volume: number) {
        this.musicHash[hashName] = {url, volume};
    }

    musicCheck(hashName: string) {
        const sound: ISound = this.musicHash[hashName];
        if (sound == null) return;
        this.music(sound.url, sound.volume);
    }

    play(url: string, volume) {
        const soundUrl = url.trim();

        this.lastUrl = soundUrl;
        this.audioElement.src = this.lastUrl;
        this.audioElement.volume = volume;

        if (!this.audioElement.paused && soundUrl == this.lastUrl) return;

        this.audioElement.play().then(value => console.log('play Then', value));
    }

    stop() {
        this.audioElement.pause();
    }
}

interface ISound {
    url: string;
    volume: number;
}

interface ISoundHash {
    [key: string]: ISound
}

/*************
 *  Collectables
 ***********/
class Collections {
    private readonly rulesMap: IRulesMap;
    private collectionMap: IWonderCollectionMap;

    constructor() {
        this.rulesMap = {};
        this.collectionMap = {};
    }

    onStoryReady(story: ITwineStory) {
        // todo посчитать коллекции
        this.initCollections(story);
    }

    // todo check
    loadState(state: IWonderCollectedState) {
        this.collectionMap = {
            ...this.collectionMap,
            ...state.collected
        }
    }

    // todo check
    getState(): IWonderCollectedState {
        return {
            collected: this.collectionMap
        }
    }

    // следует добавлять только в пользовательском скрипте или раньше
    addRule(rule: IWonderCollectRule) {
        console.log('Collections.addRule for ', rule.tags);
        rule.tags.forEach(tag => {
            if (this.rulesMap[tag] == null) {
                this.rulesMap[tag] = [];
            }
            this.rulesMap[tag].push(rule);
        });

        this.addCollection(rule);
    }

    onPassage(passage: ITwinePassage) {
        const pTags = getTags(passage);
        pTags.forEach(tag => this.collectTag(tag, passage));
    }

    /**************
     * private
     *************/

    private collectTag(passageTag: string, passage: ITwinePassage) {
        const rules = this.rulesMap[passageTag];
        if (rules == null || rules.length < 1) return;
        rules.forEach(rule => this.collectByRule(rule, passage));
    }

    private collectByRule(rule: IWonderCollectRule, passage: ITwinePassage) {
        const collection: IWonderCollection = this.collectionMap[rule.collection];
        if (collection.collected.indexOf(passage.name) < 0) {
            collection.collected.push(passage.name);
            this.onPassageCollected(passage);
        }
    }

    private onPassageCollected(passage: ITwinePassage) {
        console.log('passage collected', passage);
        console.log('collections', this.collectionMap);
    }

    private addCollection(rule: IWonderCollectRule) {
        if (this.collectionMap[rule.collection] != null) {
            console.warn('addCollection with same name ', rule.collection);
        }

        this.collectionMap[rule.collection] = {
            collected: [],
            maxAmount: 0
        }
    }


    private initCollections(story: ITwineStory) {
        story.passages.forEach(passage => {
            const pTags = getTags(passage);
            pTags.forEach(tag => {
                const rules: Array<IWonderCollectRule> = this.rulesMap[tag];
                if (rules == null) return;

                rules.forEach(rule => {
                    const collection = this.collectionMap[rule.collection];

                    if (collection == null) {
                        console.warn('collection==null for', rule.collection);
                        return;
                    }

                    // есть rule, подходящее под tag текущего пассажа?
                    // добавляем +1 к счетчик коллекции
                    collection.maxAmount++;

                })
            })
        });
        console.log('collections', this.collectionMap);
    }
}

function getTags(passage: ITwinePassage): Array<string> {
    return passage.tags.split(' ');
}

interface IRulesMap {
    [tag: string]: Array<IWonderCollectRule>
}

// коллекция
export interface IWonderCollection {
    collected: Array<string>; // сколько собрано
    maxAmount: number; // сколько вообще можно собрать
}

export interface IWonderCollectionMap {
    [collectionName: string]: IWonderCollection
}


export interface IWonderCollectRule {
    collection: string, // уникальное название коллекции
    tags: Array<string>, // какие теги собираем
    addAfter?: string,  // html, что добавляем после
    addBefore?: string, // html, что добавляем до
    hideBack?: boolean, // прячем автокнопку 'обратно'
}

export interface IWonderCollectedState {
    collected: IWonderCollectionMap
}
