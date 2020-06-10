import {LINK_INLINE_TEMPLATE, LINK_TEMPLATE, REGEXP, WONDER} from "../Constants";

export function formatTwinePassageAsHTML(content: string, template: string): string {
    const MARKER = WONDER.template;

    // 1. вынимаем из шаблона шаблон линков
    let linkTemplate: string = innerTexts(template, MARKER.choiceStart, MARKER.choiceEnd)[0];
    template = template
        .replace(linkTemplate, MARKER.choiceText)
        .replace(MARKER.choiceStart, '')
        .replace(MARKER.choiceEnd, '');

    // 2. традиционные линки
    content = content.replace(REGEXP.twineLink, function (match, catched) {
        catched = catched.trim();
        // линки могут быть встроенные или с новой строки
        const isInline = catched[0] == WONDER.inlineStart;
        if (isInline) {
            catched = catched.substring(1)
        }

        const TEMPLATE = isInline ? LINK_INLINE_TEMPLATE : LINK_TEMPLATE;

        const link = buildLink(catched);
        return getLinkHtml(link, TEMPLATE); // чистим
    })
        .trim();

    // переводы строк в br
    content = wrapLineReturnsAsParagraphs(content);


    // 99. вставляем текст
    let code = template;
    code = code.replace(MARKER.text, content.trim());

    return code;
}

function formatLineReturnsAsBreaks(content: string): string {
    return content.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

function wrapLineReturnsAsParagraphs(content: string): string {
    const lines = content.split(/(?:\r\n|\r|\n)/);

    const paragraphs = lines
        .map((line, i) => {
                line = line.trim();
                if (line.length == 0) return '';
                return `<p>${line}</p>`;
            }
        );

    return paragraphs.join('\n');
}

/**
 * @param source - строка вида Зайти в лавку гоблина|goblin
 */
function buildLink(source: string): Link {
    const parts = source.split("|");
    parts[0] = parts[0].trim();
    if (parts[1] == undefined) parts[1] = parts[0];
    return new Link(
        parts[0],
        parts[1]
    )
}

function getLinkHtml(link: Link, linkTemplate: string): string {
    let code = linkTemplate
        .replace(WONDER.template.choiceId, link.id)
        .replace(WONDER.template.choiceText, link.text)
    return code;
}

class Link {
    constructor(public text: string,
                public id: string) {
    }
}

/**
 * Вернуть массив строк, которые находятся между двумя тегами/кусками текста
 * @method innerTexts
 * @param {string} str  исходная строка
 * @param {string} startTag
 * @param {string} endTag
 * @return {Array}
 */
function innerTexts(str, startTag, endTag) {
    let subStrings = [];
    let offset = 0;
    let startIndex, endIndex;
    while (offset < str.length) {
        startIndex = str.indexOf(startTag, offset);
        if (startIndex === -1) return subStrings;
        endIndex = str.indexOf(endTag, startIndex);
        if (endIndex === -1) endIndex = undefined;

        subStrings.push(str.substring(startIndex + startTag.length, endIndex));
        offset = endIndex + endTag.length;
    }
    return subStrings;
}
