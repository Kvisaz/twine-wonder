import {Passage} from "./Passage";

export class Story {
    /**
     * следует передать элемент tw-storydata
     * @param el
     */
    constructor(
        public name:string,
        public startPassageName: string,
        public creator: string,
        public creatorVersion: string,
        public format: string,
        public formatVersion: string,
        public options: string,
        public starterScript: string,
        public passages: Array<Passage>,
        public passageHash: object  // по name хранит passage c таким же name
    ){

    }
}