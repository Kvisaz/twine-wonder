import {Passage} from "./Passage";

export class Story {
    /**
     * следует передать элемент tw-storydata
     * @param el
     */
    constructor(
        private name:string,
        private startNode: number,
        private creator: string,
        private creatorVersion: string,
        private format: string,
        private formatVersion: string,
        private options: string,
        private starterScript: string,
        private passages: Array<Passage>
    ){

    }
}