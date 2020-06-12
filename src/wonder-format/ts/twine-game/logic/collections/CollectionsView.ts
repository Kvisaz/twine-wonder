import {SingleCollectionView} from './SingleCollectionView';
import {CollectionCSS} from './CollectionCSS';
import {IWonderCollection, IWonderCollectionMap} from './CollectionInterfaces';
import {DomUtils} from '../../../app-core/DomUtils';
import {WONDER} from '../../../Constants';
import {SideBarView} from '../../SideBarView';

type ViewMap = { [collectionName: string]: SingleCollectionView };

export class CollectionsView {
    private readonly viewMap: ViewMap;
    private readonly shadow: HTMLElement;

    private isViewCreated = false;

    constructor() {
        this.viewMap = {};

        const sideBarElement = SideBarView.getSideBar1();
        sideBarElement.addEventListener('mouseup', (event) => this.findButton(event));

        this.shadow = document.createElement('div');
        this.shadow.id = CollectionCSS.shadowId;
        this.shadow.style.display = 'none';
        this.shadow.className = WONDER.shadowScreenClass;
        this.shadow.addEventListener('mouseup', (event) => this.closeAll());

        document.body.appendChild(this.shadow);
    }

    createButtons(collectionMap: IWonderCollectionMap) {

        const sideBarElement = SideBarView.getSideBar1();

        Object.keys(collectionMap).forEach(collectionName => {
            const collection = collectionMap[collectionName];
            const view = new SingleCollectionView();
            this.viewMap[collectionName] = view;
            view.update(collection);
            view.onCollectionShow(collectionName => this.onCollectionShow(collectionName))
            view.attach(sideBarElement);
        })

        this.isViewCreated = true;

    }

    updateButtons(collectionMap: IWonderCollectionMap) {
        Object.keys(collectionMap).forEach(collectionName => {
            const collection = collectionMap[collectionName];
            this.updateButton(collection);
        })
    }

    updateButton(collection: IWonderCollection) {
        if (!this.isViewCreated) return;
        const view = this.viewMap[collection.name];
        if (view == null) {
            console.warn('CollectionsView.updateButton: cannot find ', collection.name);
            return;
        }
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
                } else view.closeCollection();
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
