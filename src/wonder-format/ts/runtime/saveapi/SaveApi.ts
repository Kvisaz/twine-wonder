import {ISaveApiAppDataGetter, ISaveApiAppDataHandler} from './SaveApiInterfaces';
import {IAppState} from '../../twine-game/AppState';

export class SaveApi {
    private saveName: string = 'wonderSave';
    private isAuto = true;

    dataGetter: ISaveApiAppDataGetter;
    dataHandler: ISaveApiAppDataHandler;
    private isDisabled: boolean = false;

    enable() {
        this.isDisabled = false;
    }

    disable(disable = true) {
        this.isDisabled = disable;
    }

    autoSave(enable = true) {
        this.isAuto = enable;
        if (enable) console.log('save api is enabled');
        else console.log('save api is disable')
    }

    saveSlot(saveName: string) {
        this.saveName = saveName;
    }

    save(saveName = this.saveName) {
        if (this.dataGetter == null) return;
        if (this.isDisabled) return;
        const data = this.dataGetter();
        localStorage.setItem(saveName, JSON.stringify(data));
    }

    load(saveName: string = this.saveName) {
        if (this.isDisabled) return;
        if (this.dataHandler == null) return;
        const state = JSON.parse(localStorage.getItem(saveName)) as IAppState;
        this.dataHandler(state);
    }

    loadFrom(obj: object) {
        this.dataHandler(obj as IAppState);
    }

    onPassage() {
        if (this.isDisabled) return;
        if (this.isAuto) {
            this.save(this.saveName);
        }
    }
}
