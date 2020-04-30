import {SingleCollectionView} from './SingleCollectionView';
import {CollectionCSS} from './CollectionCSS';
import {IRulesMap, IWonderCollectionMap} from './CollectionInterfaces';

type ViewMap = { [collectionName: string]: SingleCollectionView };

export class CollectionsView {
    private readonly viewMap: ViewMap;
    private readonly el: HTMLElement;

    constructor() {
        this.viewMap = {};
        this.el = document.createElement('div');
        this.el.id = CollectionCSS.wrapperId;
    }

    createViews(collectionMap: IWonderCollectionMap) {
        Object.keys(collectionMap).forEach(collectionName => {
            const collection = collectionMap[collectionName];
            const view = new SingleCollectionView();
            this.viewMap[collectionName] = view;
            view.update(collection);
            view.attach(this.el);
        })

        document.body.appendChild(this.el);
    }

    updateViews() {

    }
}
