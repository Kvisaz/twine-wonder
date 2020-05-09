import {ITwinePassage, ITwineStory} from '../../../abstract/TwineModels';
import {CollectionsView} from './CollectionsView';
import {IRulesMap, IWonderCollection, IWonderCollectionMap, IWonderCollectRule} from './CollectionInterfaces';
import {STORE, STORY_STORE} from '../../Stores';

/*************
 *  Collectables
 ***********/
export class Collections {
    private readonly rulesMap: IRulesMap;
    private collectionsView: CollectionsView;

    constructor() {
        this.rulesMap = {};
        this.collectionsView = new CollectionsView();
    }

    getCollectionMap(): IWonderCollectionMap {
        return STORE.user.collectionMap;
    }

    getCollection(name: string): IWonderCollection {
        return STORE.user.collectionMap[name];
    }

    onStoryReady() {
        this.initCollections();

        setTimeout(() => {
            this.collectionsView.createViews(this.getCollectionMap())
        }, 500)
    }

    onStateUpdate() {
        this.collectionsView.updateButtons(this.getCollectionMap());
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
        const pTags = this.getTags(passage);
        pTags.forEach(tag => this.collectTag(tag, passage));
        this.onStateUpdate();
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
        const collection: IWonderCollection = this.getCollectionMap()[rule.collection];
        if (collection.collected.indexOf(passage.name) < 0) {
            collection.collected.push(passage.name);
            this.onPassageCollected(passage, collection);
        }
    }

    private onPassageCollected(passage: ITwinePassage, collection: IWonderCollection) {
        this.collectionsView.updateButton(collection);
    }

    private addCollection(rule: IWonderCollectRule) {
        if (this.getCollection(rule.collection) != null) {
            console.warn('addCollection with same name ', rule.collection);
            return;
        }

        this.getCollectionMap()[rule.collection] = {
            name: rule.collection,
            title: rule.title,
            collected: [],
            maxAmount: 0
        }
    }


    private initCollections() {
        const story: ITwineStory = STORY_STORE.story;

        // защита от загрузки
        Object.keys(this.getCollectionMap()).forEach(cName => {
            this.getCollection(cName).maxAmount = 0;
        })

        story.passages.forEach(passage => {
            const pTags = this.getTags(passage);
            pTags.forEach(tag => {
                const rules: Array<IWonderCollectRule> = this.rulesMap[tag];
                if (rules == null) return;

                rules.forEach(rule => {
                    const collection = this.getCollection(rule.collection);

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
    }

    private getTags(passage: ITwinePassage): Array<string> {
        return passage.tags.split(' ');
    }
}
