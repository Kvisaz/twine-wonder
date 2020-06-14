// twine tags

import {GameMenuCSS} from './twine-game/logic/menu/GameMenuCSS';

export const STORY_SELECTOR = "tw-storydata";
export const PASSAGE_SELECTOR = "tw-passagedata";

export const COMMON_CSS = {
    displayNone: "displayNone",
    pointerOver: "pointerOver",
    visited: "visited",
    back: "back",
    back2: "back2"
};

// wonder selector
export const WONDER = {
    shadowScreenClass: 'scr-shadow',
    preloadId: 'preload',
    wrapperId: 'wrapperId',
    sideBarId: 'sideBarId',
    sideBar2Id: 'sideBar2Id',
    preloadAnchorId: 'preload-anchor',
    startScreenId: 'start-screen',
    newGameBtId: 'new-game-button',
    continueBtId: 'continue-button',
    buttonClass: 'w-button',
    contentId: "wonder-content",
    pageClass: "page",
    pageContentClass: "page-content",
    textClass: "text",
    choiceClass: "choice",
    inlineClass: "inline",
    linkClass: "link",
    pressedClass: "pressed",
    linkAloneClass: "link-alone",
    newLineClass: "newLine",
    linkInlineClass: "inline",
    noSelectClass: "noselect",
    selectClass: "select",
    paramClass: 'params',
    visitedClass: COMMON_CSS.visited,
    backClass: COMMON_CSS.back,
    backClass2: COMMON_CSS.back2,
    invisibleClass: COMMON_CSS.displayNone,
    template: {
        text: "<text/>",
        choices: "<choices/>",    // начало повторяющегося блока
        choiceStart: "<choice>",    // начало повторяющегося блока
        choiceEnd: "</choice>", // конец повторяющегося блока
        choiceText: "<choice-text/>", // текст выбора
        choiceId: "<choice-id/>", // текст выбора
    },
    passages: {
        config: "wonder.config",
        pageFormat: "wonder.format.page",
        choiceFormat: "wonder.format.choice",
        textFormat: "wonder.format.text",
    },
    markLang: {
        varStart: "var",
        commandSplitter: ":",
    },
    replace: {
        button: {
            id:  '#id#',
            command:  '#command#',
            label:  '#label#',
        }

    },
    inlineStart: "=",

};


const REGEXP_ANY = '([\\s\\S]*?)';

// regexps
export const REGEXP = {
    exeScript: new RegExp('{{' + REGEXP_ANY + '}}', "g"),

    // /\[\[(.*?)\]\]/g - при переводе в строку удваивем  \
    twineLink: new RegExp('\\[\\[' + REGEXP_ANY + '\\]\\]', "g"),
};

// templates
export const PRELOAD_PAGE_TEMPLATE = `<div id=${WONDER.preloadAnchorId}></div>`;

export const PAGE_TEMPLATE = `<div class="${WONDER.noSelectClass} ${WONDER.pageClass}"></div>`;

export const LINK_TEMPLATE = `<button class="${WONDER.linkClass}  ${WONDER.linkAloneClass}" data-id="${WONDER.template.choiceId}">${WONDER.template.choiceText}</button>`;

export const LINK_INLINE_TEMPLATE = `<span  class="${WONDER.inlineClass}" ><button class="${WONDER.linkClass}" data-id="${WONDER.template.choiceId}">${WONDER.template.choiceText}</button></span>`

export const BACK_TEMPLATE = `<button class="${WONDER.backClass}">Назад</button>`;
export const BACK_COLLECTION_TEMPLATE = `<button class="${WONDER.backClass} ${WONDER.backClass2}">Закрыть</button>`;

export const BT_START_TEMPLATE = `<button id="${WONDER.replace.button.id}" class="${WONDER.buttonClass}" data-command="${WONDER.replace.button.command}">${WONDER.replace.button.label}</button>`;

export const GAME_MENU_BUTTON_TEMPLATE = `<button id="${GameMenuCSS.mainButtonId}" class="${GameMenuCSS.mainButtonClass}">${WONDER.replace.button.label}</button>`;

// done 0 скрипты через {{}}
// todo 1 произвольное создание параметров, инжектирование в params
// rejected 2 общий шаблон Passage-Template - конфликт display: none с flex
// done 3 flex css для page
export const PASSAGE_TEMPLATE = `<div class="${WONDER.pageContentClass}">
<div class="${WONDER.paramClass}" ><div id="gold"></div></div>
<div class="${WONDER.textClass}"><text/>${BACK_TEMPLATE}</div>
</div>`;

export const PASSAGE_COLLECTION_TEMPLATE = `<div class="${WONDER.pageContentClass}">
${BACK_COLLECTION_TEMPLATE}<div class="${WONDER.textClass}"><text/>${BACK_TEMPLATE}</div>
</div>`;
