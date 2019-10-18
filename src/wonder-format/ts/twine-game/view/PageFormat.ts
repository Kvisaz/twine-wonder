import {WONDER} from "../../Constants";
import {DomUtils} from "../../app-core/DomUtils";

export class PageFormat {
    private format = DEFAULT_FORMAT;

    setFormat(format: string) {
        this.format = format;
    }

    buildPage(pageContent: Element): Element {
        const pageEl = DomUtils.elementFromTemplate(this.format);
        pageEl.appendChild(pageContent);
        return <Element>pageEl;
    }
}

const DEFAULT_FORMAT = `
  <div class="${WONDER.pageClass}">
  </div>
`.trim();