import {DomUtils} from "../../app-core/DomUtils";

export interface ContentFormatter {
    (content: string, template: string): string;
}

/**
 *  Универсальный форматтер
 *  - устанавливает выбранный шаблон
 */
export class ViewBuilder {

    protected contentFormatter: ContentFormatter = (str, template) => template;

    constructor(protected template: string) {
    }

    setTemplate(template: string) {
        this.template = template;
    }

    setContentFormatter(formatter: ContentFormatter) {
        this.contentFormatter = formatter;
    }

    build(content: string = ""): Element {
        const formatted = this.contentFormatter(content, this.template);
        const pageEl = <Element>DomUtils.elementFromTemplate(formatted);
        return <Element>pageEl;
    }

}
