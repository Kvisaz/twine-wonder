import {SingleCollectionView} from './SingleCollectionView';
import {CollectionCSS} from './CollectionCSS';
import {IWonderCollection, IWonderCollectionMap} from './CollectionInterfaces';
import {DomUtils} from '../../app-core/DomUtils';

type ViewMap = { [collectionName: string]: SingleCollectionView };

export class CollectionsView {
    private readonly viewMap: ViewMap;
    private readonly buttonWrapper: HTMLElement;
    private readonly shadow: HTMLElement;

    constructor() {
        this.viewMap = {};
        this.buttonWrapper = document.createElement('div');
        this.buttonWrapper.id = CollectionCSS.wrapperId;
        this.buttonWrapper.addEventListener('mouseup', (event) => this.findButton(event));

        this.shadow = document.createElement('div');
        this.shadow.id = CollectionCSS.shadowId;
        this.shadow.style.display = 'none';
        this.shadow.style.position = 'absolute';
        this.shadow.style.width = '100%';
        this.shadow.style.height = '100%';
        this.shadow.style.background = '#000';
        this.shadow.style.opacity = '0.3';
        this.shadow.addEventListener('mouseup', (event) => this.closeAll());
    }

    createViews(collectionMap: IWonderCollectionMap) {

        document.body.appendChild(this.shadow);

        Object.keys(collectionMap).forEach(collectionName => {
            const collection = collectionMap[collectionName];
            const view = new SingleCollectionView();
            this.viewMap[collectionName] = view;
            view.update(collection);
            view.onCollectionShow(collectionName => this.onCollectionShow(collectionName))
            view.attach(this.buttonWrapper);
        })

        document.body.appendChild(this.buttonWrapper);
    }

    updateButtons(collectionMap: IWonderCollectionMap) {
        Object.keys(collectionMap).forEach(collectionName => {
            const collection = collectionMap[collectionName];
            this.updateButton(collection)
        })
    }

    updateButton(collection: IWonderCollection) {
        const view = this.viewMap[collection.name];
        console.log('updateButton', collection);
        view.update(collection);
    }

    /**
     *  PRIVATE
     */
    private onCollectionShow(collectionName: string) {
        Object.keys(this.viewMap).forEach(nextCollectionName => {
            if (collectionName != nextCollectionName) {
                this.viewMap[nextCollectionName].closeCollection();
            }
        })
    }

    private findButton(e: MouseEvent) {
        const button: HTMLElement = <HTMLElement>DomUtils.closest(e.target as HTMLElement, `.${CollectionCSS.button}`);

        if (button) {
            const collectionName = button.dataset.collection;
            console.log('findButton ', collectionName);
            Object.keys(this.viewMap).forEach(name => {
                const view = this.viewMap[name];
                if (view == null) {
                    console.warn('Collections.findButton - null view', collectionName);
                    return;
                }

                if (name == collectionName) {
                    this.shadow.style.display = 'block';
                    view.showCollection();
                }
                else view.closeCollection();
            })
        }
    }

    private closeAll() {
        Object.keys(this.viewMap).forEach(name => {
            this.viewMap[name].closeCollection();
        });
        this.shadow.style.display = 'none';
    }
}
