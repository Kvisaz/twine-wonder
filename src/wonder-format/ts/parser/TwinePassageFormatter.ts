import {LINK_TEMPLATE, WONDER} from "../Constants";

export function twinePassageFormatter(content: string, template: string): string {
    console.log(`twinePassageFormatter....`);
    const links: Array<Link> = [];
    const MARKER = WONDER.template;
    
    // 1. вынимаем из шаблона шаблон линков
    let linkTemplate: string = innerTexts(template, MARKER.choiceStart, MARKER.choiceEnd)[0];
    template = template
        .replace(linkTemplate, MARKER.choiceText)
        .replace(MARKER.choiceStart, '')
        .replace(MARKER.choiceEnd, '');

    // 1. убираем линки
    content = content.replace(/\[\[(.*?)\]\]/g, function (match, catched) {
        links.push(buildLink(catched));
        return ""; // чистим
    })
        .trim();

    // 99. вставляем текст
    let code = template;
    code = code.replace(MARKER.text, content.trim());

    // 100. вставляем линки
    let linkCode = "";
    links.forEach(link => {
        linkCode += getLinkHtml(link);
    });
    code = code.replace(MARKER.choices, linkCode);
    return code;
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

function getLinkHtml(link: Link): string {
    let code = LINK_TEMPLATE
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