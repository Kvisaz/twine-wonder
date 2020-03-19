import {ITwinePassage} from '../abstract/TwineModels';

export class RunTime {
    private audioPlayer: AudioPlayer;

    constructor() {
        this.audioPlayer = new AudioPlayer();
    }

    /***********
     *  Стили, дизайн
     **********/

    /************
     *  Подключить стиль
     *  todo - не работает после экспорта, стиль не грузится
     ***********/
    styleUrl(styleUrl:string) {
        const styleEl: HTMLElement = document.createElement('link');
        styleEl.setAttribute('rel', 'stylesheet');
        styleEl.setAttribute('href', styleUrl);
        document.head.appendChild(styleEl);
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

    /***********
     *  Выполнить действие на локации
     **********/
    onLocation(location: ITwinePassage) {
        console.log('location', location);
        this.audioPlayer.musicCheck(location.name);
    }
}


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
