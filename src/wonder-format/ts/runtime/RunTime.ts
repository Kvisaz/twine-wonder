import {IWonderLocation} from '../parser/models/WonderTwineModels';

export class RunTime {
    private audioPlayer: AudioPlayer;

    constructor() {
        this.audioPlayer = new AudioPlayer();
    }

    music(url: string, volume = 1) {
        this.audioPlayer.music(url, volume);
    }

    sound(url: string, volume = 1) {
        this.audioPlayer.sound(url, volume);
    }

    musicStop() {
        this.audioPlayer.stop();
    }

    onLocation(location: IWonderLocation) {
        console.log('location', location)
    }
}


class AudioPlayer {
    private audioElement: HTMLAudioElement;
    private lastUrl: string;

    constructor() {
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
