/**
 *  Содержит несколько страниц, может их менять
 */
import {PageAnimator} from "./PageAnimator";
import {ArrayUtils} from "../../app-core/ArrayUtils";
import {DomUtils} from "../../app-core/DomUtils";

export class PageView {
    protected pages: Array<Element> = [];
    protected currentPage = -1;
    protected animator: PageAnimator = new PageAnimator();

    setAnimator(animator: PageAnimator) {
        this.animator = animator;
    }

    addPage(el: Element) {
        this.pages.push(el);
    }

    /**
     * Показать следующую страницу
     */
    next() {
        const PREV = this.getCurrent();
        this.currentPage++;
        this.setCurrent(this.currentPage);
        const NEXT = this.getCurrent();

        this.switch(PREV, NEXT);
    }

    /**
     *  Показать предыдущую страницы
     */
    previous() {
        const PREV = this.getCurrent();
        this.currentPage--;
        this.setCurrent(this.currentPage);
        const NEXT = this.getCurrent();

        this.switch(PREV, NEXT);
    }

    /*********
     *  PRIVATE
     ********/

    protected switch(from: Element, to: Element) {
        if (from) this.animator.hide(from);
        this.animator.show(to);
    }

    protected getCurrent(): Element {
        return this.pages[this.currentPage];
    }

    /**
     * Циклически идет по кругу,
     * переключает на конец или начало, если выходит за рамки
     * @param n
     */
    protected setCurrent(n: number) {
        if (this.pages.length == 0) {
            throw "setCurrent error - void pages";
        }

        const max = this.pages.length - 1;
        if (n > max) n = 0;
        else if (n < 0) n = max;

        this.currentPage = n;
    }

    protected dropPage(index: number) {
        const removed: Element = ArrayUtils.remove(this.pages, index);
        if (removed == null) {
            console.warn(`dropPage: try to remove undefined page`);
            return;
        }
        DomUtils.remove(removed);
    }

}