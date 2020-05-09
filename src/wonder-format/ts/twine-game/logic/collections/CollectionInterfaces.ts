export interface IRulesMap {
    [tag: string]: Array<IWonderCollectRule>
}

// коллекция
export interface IWonderCollection {
    name: string; // уникальное название коллекции
    title: string; // читабельное имя для юзера
    collected: Array<string>; // собранные пассажи
    maxAmount: number; // сколько вообще можно собрать
}

export interface IWonderCollectionMap {
    [collectionName: string]: IWonderCollection
}

export interface IWonderCollectRule {
    collection: string, // уникальное название коллекции
    tags: Array<string>, // какие теги собираем
    title: string, // название кнопки
    addAfter?: string,  // html, что добавляем после
    addBefore?: string, // html, что добавляем до
    hideBack?: boolean, // прячем автокнопку 'обратно'
}


export interface ICollectionShowCallback {
    (collectionName: string): void
}
