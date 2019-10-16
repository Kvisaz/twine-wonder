import {Passage} from "./Passage";

export class Story {
    /**
     * следует передать элемент tw-storydata
     * @param el
     */
    constructor(
        public name:string,
        public startNode: number,
        public creator: string,
        public creatorVersion: string,
        public format: string,
        public formatVersion: string,
        public options: string,
        public starterScript: string,
        public passages: Array<Passage>
    ){

    }
}