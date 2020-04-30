import {ITwinePassage, ITwineStory} from '../../abstract/TwineModels';
import {CollectionsView} from './CollectionsView';
import {
    ICollectionState,
    IRulesMap,
    IWonderCollection,
    IWonderCollectionMap,
    IWonderCollectRule
} from './CollectionInterfaces';
import {STORY_STORE} from '../../twine-game/StoryStore';

/*************
 *  Collectables
 ***********/
export class Collections {
    private readonly rulesMap: IRulesMap;
    private collectionMap: IWonderCollectionMap;
    private collectionsView: CollectionsView;

    constructor() {
        this.rulesMap = {};
        this.collectionMap = {};
        this.collectionsView = new CollectionsView();
    }

    onStoryReady() {
        // todo посчитать коллекции
        this.initCollections();

        // TODO show buttons
        setTimeout(() => {
            this.collectionsView.createViews(this.collectionMap)
        }, 500)
    }

    // todo check
    loadState(state: ICollectionState) {
        this.collectionMap = {
            ...this.collectionMap,
            ...state.collected
        }

        this.collectionsView.updateButtons(this.collectionMap)
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
            this.onPassageCollected(passage, collection);
        }
    }

    private onPassageCollected(passage: ITwinePassage, collection: IWonderCollection) {
        console.log('passage collected', passage);
        console.log('collections', this.collectionMap);
        this.collectionsView.updateButton(collection);
    }

    private addCollection(rule: IWonderCollectRule) {
        if (this.collectionMap[rule.collection] != null) {
            console.warn('addCollection with same name ', rule.collection);
        }

        this.collectionMap[rule.collection] = {
            name: rule.collection,
            title: rule.title,
            collected: [],
            maxAmount: 0
        }
    }


    private initCollections() {
        const story: ITwineStory = STORY_STORE.story;

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

    /************
     *  VIEW
     ***********/


}

function getTags(passage: ITwinePassage): Array<string> {
    return passage.tags.split(' ');
}
