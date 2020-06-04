import {ITwinePassage, ITwineStory} from '../../../abstract/TwineModels';
import {CollectionsView} from './CollectionsView';
import {IRulesMap, IWonderCollection, IWonderCollectionMap, IWonderCollectRule} from './CollectionInterfaces';
import {IMap} from '../../../abstract/WonderInterfaces';

/*************
 *  Collectables
 ***********/
export class Collections {
    private rules: Array<IWonderCollectRule>;
    private rulesMap: IRulesMap;
    private collectionsMap: IWonderCollectionMap;
    private collectionsView: CollectionsView;

    constructor() {
        this.rules = [];
        this.collectionsView = new CollectionsView();
    }

    onUserStateReady(story: ITwineStory, visitedPageMap: IMap<boolean>) {
        this.initCollections(story, visitedPageMap);
        setTimeout(() => {
            this.collectionsView.createButtons(this.collectionsMap)
        }, 500)
    }

    onStateUpdate() {
        this.collectionsView.updateButtons(this.collectionsMap);
    }

    // следует добавлять только в пользовательском скрипте или раньше
    addRule(rule: IWonderCollectRule) {
        if (this.rules == null) this.rules = [];
        this.rules.push(rule);
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
        const collection: IWonderCollection = this.collectionsMap[rule.collection];
        if (collection.collected.indexOf(passage.name) < 0) {
            collection.collected.push(passage.name);
            this.onPassageCollected(passage, collection);
        }
    }

    private onPassageCollected(passage: ITwinePassage, collection: IWonderCollection) {
        this.collectionsView.updateButton(collection);
    }

    private buildCollection(rule: IWonderCollectRule): IWonderCollection {
        return {
            name: rule.collection,
            title: rule.title,
            collected: [],
            maxAmount: 0
        }
    }


    private initCollections(story: ITwineStory, visitedPageMap: IMap<boolean>) {

        const rules = this.rules;
        const rulesMap: IRulesMap = this.buildRuleMap(rules);

        const collections: Array<IWonderCollection> = this.buildCollections(rules);
        const collectionsMap = this.buildCollectionMap(collections);

        this.calculateAmounts(story, rulesMap, collectionsMap, visitedPageMap);

        this.rulesMap = rulesMap;
        this.collectionsMap = collectionsMap;
    }

    private buildCollectionMap(collections: Array<IWonderCollection>): IWonderCollectionMap {
        const collectionMap = {};
        collections.forEach(col => {
            if (collectionMap[col.name] != null) {
                console.warn('buildCollection with same name ');
                console.log(collectionMap, col);
                return;
            }
            collectionMap[col.name] = col;
        });
        return collectionMap;
    }

    private buildRuleMap(rules: Array<IWonderCollectRule>): IRulesMap {
        const ruleMap = {};
        rules.forEach(rule => {
            rule.tags.forEach(tag => {
                if(ruleMap[tag]==null) ruleMap[tag] = [];
                ruleMap[tag].push(rule)
            });
        });
        return ruleMap;
    }

    private calculateAmounts(story: ITwineStory, rulesMap: IRulesMap, collectionMap: IWonderCollectionMap, visitedPages: IMap<boolean>) {
        const P_LENGTH = story.passages.length;

        for (let i = 0; i < P_LENGTH; i++) {
            this.countPassage(story.passages[i],
                rulesMap,
                collectionMap,
                visitedPages);
        }
    }

    private countPassage(passage: ITwinePassage,
                         rulesMap: IRulesMap,
                         collectionMap: IWonderCollectionMap,
                         visitedPages: IMap<boolean>) {
        const passageTags = this.getTags(passage);
        if (passageTags == null) return;
        passageTags.forEach(tag => {
            this.countTag(tag,
                rulesMap,
                collectionMap,
                visitedPages,
                passage.name);
        })
    }

    private countTag(tag: string,
                     rulesMap: IRulesMap,
                     collectionMap: IWonderCollectionMap,
                     visitedPages: IMap<boolean>,
                     passageName: string) {

        const rules = rulesMap[tag];
        if (rules == null) return;

        rules.forEach(rule => {
            const collection = collectionMap[rule.collection];

            if (collection == null) {
                console.warn('collection==null for');
                console.log(rule.collection, collectionMap);
                return;
            }

            // есть rule, подходящее под tag текущего пассажа?
            // добавляем +1 к счетчик коллекции
            collection.maxAmount++;
            // если собрали - увеличиваем
            if (visitedPages[passageName] == true) collection.collected.push(passageName);
        })
    }

    private buildCollections(rules: Array<IWonderCollectRule>): Array<IWonderCollection> {
        if (rules == null) return [];
        return rules.map(rule => this.buildCollection(rule));
    }

    private getTags(passage: ITwinePassage): Array<string> {
        return passage.tags.split(' ');
    }
}
