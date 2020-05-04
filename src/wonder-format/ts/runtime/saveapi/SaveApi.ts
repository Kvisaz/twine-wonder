import {ISaveApiAppDataGetter, ISaveApiAppDataHandler} from './SaveApiInterfaces';
import {IAppState} from '../../twine-game/AppState';

export class SaveApi {
    private autoSaveName: string;

    dataGetter: ISaveApiAppDataGetter;
    dataHandler: ISaveApiAppDataHandler;

    autoSave(saveName: string) {
        this.autoSaveName = saveName;
    }

    save(saveName: string) {
        if (this.dataGetter == null) return;
        const data = this.dataGetter();
        localStorage.setItem(saveName, JSON.stringify(data));
    }

    load(saveName: string) {
        if (this.dataHandler == null) return;
        const state = JSON.parse(localStorage.getItem(saveName)) as IAppState;
        this.dataHandler(state);
    }

    onPassage() {
        if (this.autoSaveName = null) return;
        this.save(this.autoSaveName);
    }
}
