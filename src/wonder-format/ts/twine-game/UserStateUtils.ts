import {UserState} from './AppState';
import {IWonderCollectionMap} from './logic/collections/CollectionInterfaces';
import {IMap} from '../abstract/WonderInterfaces';

export class UserStateUtils {
    /**
     * @mutable
     * операция по восстановлению некоторых посещенных страниц
     * для совместимости формата
     */
    static restoreCollectedAsVisited(state: UserState) {
        const hasAnyVisited = state.visitedPageMap && Object.keys(state.visitedPageMap).length > 0;
        if (hasAnyVisited) return;

        const hasDeprecatedCollectionMap = state.collectionMap != null && Object.keys(state.collectionMap).length > 0;
        if (!hasDeprecatedCollectionMap) return;

        // нет посещений, но есть устаревший набор коллекций
        // - восстанавливаем часть страниц по коллекциям
        const collectedPageNames = getVisitedPageMap(state.collectionMap)
        state.visitedPageMap = {
            ...collectedPageNames
        }

    }
}

// если страницы собраны - значит они посещены
function getVisitedPageMap(collectionMap: IWonderCollectionMap): IMap<boolean> {
    const visited: IMap<boolean> = {};

    const collections = Object.keys(collectionMap).map(collectionName => collectionMap[collectionName]);

    collections.forEach(col => {
        if (col.collected) {
            col.collected.forEach(passageName => visited[passageName] = true)
        }
    });

    return visited;
}
