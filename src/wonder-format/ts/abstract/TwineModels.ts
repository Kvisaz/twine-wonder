import {IMap} from './WonderInterfaces';

export interface ITwineStory {
    name: string,
    style: string,
    script: string,
    startPassageName: string,
    startnode: string,
    creator: string,
    creatorVersion: string,
    format: string,
    formatVersion: string,
    ifid: string,
    options: string,
    passages: Array<ITwinePassage>,
    passageHash: IMap<ITwinePassage>,  // по name хранит passage c таким же name
    zoom: string  // по name хранит passage c таким же name
}

export interface ITwinePassage {
    pid: string;
    name: string; // уникальное имя, используемые для ссылки
    tags: string;
    position: string;
    size: string;
    content: string;
}

export class Passage implements ITwinePassage {
    constructor(
        public pid: string,
        public name: string,
        public tags: string,
        public position: string,
        public size: string,
        public content: string,
    ) {
    }
}

export class Story implements ITwineStory {
    constructor(
        public name: string,
        public style: string,
        public script: string,
        public startPassageName: string,
        public startnode: string,
        public creator: string,
        public creatorVersion: string,
        public format: string,
        public formatVersion: string,
        public ifid: string,
        public options: string,
        public passages: Array<ITwinePassage>,
        public passageHash: IMap<ITwinePassage>,  // по name хранит passage c таким же name
        public zoom: string  // по name хранит passage c таким же name
    ) {

    }
}
