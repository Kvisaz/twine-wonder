export const enum UserScriptCommand {
    start = 'start', // параметр name, delay
    enableExternalApi = 'enableExternalApi',
    saveSlot = 'saveSlot',
    save = 'save',
    load = 'load',
    collectionRule = 'collectionRule', // data - rule: IWonderCollectRule
    music = 'music',
    musicFor = 'musicFor',
    sound = 'sound',
    musicStop = 'musicStop',
    pageAdd = 'pageAdd',
    pageBefore = 'pageBefore',
    pageWrap = 'pageWrap',
    startPage = 'startPage',
}
