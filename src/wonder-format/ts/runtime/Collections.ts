import {ITwinePassage, ITwineStory} from '../abstract/TwineModels';

/*************
 *  Collectables
 ***********/
export class Collections {
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
    loadState(state: ICollectionState) {
        this.collectionMap = {
            ...this.collectionMap,
            ...state.collected
        }
    }

    // todo check
    getState(): ICollectionState {
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
    collected: Array<string>; // собранные пассажи
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

export interface ICollectionState {
    collected: IWonderCollectionMap
}
