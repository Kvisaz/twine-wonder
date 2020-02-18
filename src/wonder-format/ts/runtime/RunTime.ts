import {IWonderLocation} from '../parser/models/WonderTwineModels';

export class RunTime {
    private audioPlayer: AudioPlayer;

    constructor() {
        this.audioPlayer = new AudioPlayer();
    }

    music(url: string) {
        this.audioPlayer.music(url);
    }

    onLocation(location: IWonderLocation){
        console.log('location', location)
    }
}


class AudioPlayer {
    private audioElement: HTMLAudioElement;

    constructor() {
        this.audioElement = new Audio();
    }

    music(url: string) {
        this.play(url);
    }

    play(url: string) {
        this.audioElement.src = url.trim();
        this.audioElement.play().then(value => console.log('play Then', value))
    }
}
