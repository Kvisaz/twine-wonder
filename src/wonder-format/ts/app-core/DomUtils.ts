
export class DomUtils {
    static canvas; // утилитный канвас

    static elementFromTemplate(template: string): Node {
        let div = document.createElement(`div`);
        div.innerHTML = template;
        return div.firstChild;
    }

    // добавить child в parent под child с заданным id (если такой существует)
    static addChildBefore(parent: Element, newChild: Element, id: string) {
        let child: Element;
        let notAdded = true;
        let children = parent.children;

        // если id не задан - добавляем последним
        if (id == null || id.length == 0) {
            parent.appendChild(newChild);
            return;
        }

        // иначе пробуем найти и вставить перед элементом с id
        for (let i = 0; i < children.length; i++) {
            child = children[i];
            if (child.id == id) {
                parent.insertBefore(newChild, child);
                notAdded = false;
                return;
            }
        }

        // если не нашли - добавляем последнием
        if (notAdded) {
            parent.appendChild(newChild);
        }
    }

    static remove(el: Element) {
        if (el.parentNode) el.parentNode.removeChild(el);
    }

    // добавить, только если ребенка нет
    static addChildIfNot(parent: Element, el: Element) {
        if (el.parentNode != parent) parent.appendChild(el);
    }

    static bringToTop(el: Element) {
        if (el.parentNode) el.parentNode.appendChild(el);
    }

    static matches(el: Element, selector: string): boolean {
        return matches.call(el, selector);
    }

    static copyToClipboard(str: string) {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    static getBlobURL(code, type): string {
        const blob = new Blob([code], {type})
        return URL.createObjectURL(blob);
    }

    static getHtmlBlobUrl(code): string {
        return DomUtils.getBlobURL(code, "text/html");
    }

    static removeAllChildren(el: Element) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }




    /**
     * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
     *
     * @param {String} text The text to be rendered.
     * @param {String} fontCss The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
     *
     * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
     */
    static getTextMetrics(text: string, fontCss: string): TextMetrics {
        // re-use canvas object for better performance
        if (DomUtils.canvas == null) {
            DomUtils.canvas = document.createElement("canvas") as HTMLCanvasElement;
        }
        const context = DomUtils.canvas.getContext("2d");
        context.font = fontCss;
        return context.measureText(text);
    }

    static getTextWidth(text: string, fontCss: string): number {
        return DomUtils.getTextMetrics(text, fontCss).width;
    }

    static isFullScreenEnabled(): boolean {
        return document.fullscreenEnabled ||
            // @ts-ignore
            document.webkitFullscreenEnabled ||
            // @ts-ignore
            document.mozFullScreenEnabled ||
            // @ts-ignore
            document.msFullscreenEnabled;
    }

    static closest(child: Element, selector: string): Element {
        let next = child;
        let i = 0;
        do {
            if (next == null) return null;
            if (DomUtils.matches(next, selector)) return next;
            next = next.parentElement;
        } while (i++ < 10000);

        console.warn(` ${i} loops - check code for errors!`);

    }

    static prepend(parent: Element, child: Element) {
        parent.insertBefore(child, parent.firstChild);
    }
}

/******
 *  Polyfills
 *****/

const matches = Element.prototype.matches ||
    // @ts-ignore
    Element.prototype.matchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    // @ts-ignore
    Element.prototype.mozMatchesSelector ||
    // @ts-ignore
    Element.prototype.msMatchesSelector;
