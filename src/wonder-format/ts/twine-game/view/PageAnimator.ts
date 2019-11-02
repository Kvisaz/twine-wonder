import {COMMON_CSS} from "../../Constants";

export class PageAnimator {
    show(el: Element, duration = 0) {
        console.log(`show el`, el);
        el.classList.remove(COMMON_CSS.displayNone);
    }

    hide(el: Element, duration = 0) {
        console.log(`hide el`, el);
        el.classList.add(COMMON_CSS.displayNone);
    }
}