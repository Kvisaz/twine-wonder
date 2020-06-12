import {WONDER} from '../Constants';

export class SideBarView {

    private static create(id:string) {
        const sideBarEl = document.createElement("div");
        sideBarEl.id = id;
        document.body.appendChild(sideBarEl);
        return sideBarEl;
    }

    static createSideBar1(): HTMLElement {
        return SideBarView.create(WONDER.sideBarId);
    }

    static createSideBar2(): HTMLElement {
        return SideBarView.create(WONDER.sideBar2Id);
    }

    static getSideBar1(): HTMLElement {
        return document.querySelector(`#${WONDER.sideBarId}`);
    }

    static getSideBar2(): HTMLElement {
        return document.querySelector(`#${WONDER.sideBar2Id}`);
    }
}
