import {PageView} from "./PageView";

/**
 *  Очередь страниц с ограниченной емкостью
 *  при добавлении страницы - первая выбрасывается
 */
export class PagePairView extends PageView {

    private limit = 2;

    addPage(el: Element) {
        super.addPage(el);
        if (this.pages.length > this.limit) {
            console.warn(`add over limit page!`);
            this.dropPage(0);
        }
    }
    
}