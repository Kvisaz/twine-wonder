/*************
 *  Audio
 ***********/
export class AudioPlayer {
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
