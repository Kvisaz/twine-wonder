// twine tags
import {StyleInjector} from "./app-core/StyleInjector";

export const STORY_SELECTOR = "tw-storydata";
export const PASSAGE_SELECTOR = "tw-passagedata";

// wonder selector
export const WONDER = {
    contentId: "wonder-content",
    pageClass: "wonder-page",
    textClass: "wonder-text",
    linkClass: "wonder-link",
    template: {
        text: "<text/>",
        choices: "<choices/>",    // начало повторяющегося блока
        choiceStart: "<choice>",    // начало повторяющегося блока
        choiceEnd: "</choice>", // конец повторяющегося блока
        choiceText: "<choice-text/>", // текст выбора
        choiceId: "<choice-id/>", // текст выбора
    },
    command: {
        show: "=",
    },
    passages: {
        config: "wonder.config",
        // todo
        pageFormat: "wonder.format.page",
        choiceFormat: "wonder.format.choice",
        textFormat: "wonder.format.text",
    },
    markLang: {
        varStart: "var",
        commandSplitter: ":"
    }
};

// regexps
export const REGEXP = {
    exeScript: new RegExp("<w>([\\s\\S]*?)<\/w>", "gs"),

    // /\[\[(.*?)\]\]/g - при переводе в строку удваивем  \
    twineLink: new RegExp("\\[\\[(.*?)\\]\\]", "g"),
};

// templates
export const PAGE_TEMPLATE = `<div class="${WONDER.pageClass}"></div>`;

export const LINK_TEMPLATE = `<li class="${WONDER.linkClass}" data-id="${WONDER.template.choiceId}">${WONDER.template.choiceText}</li>`;

export const PASSAGE_TEMPLATE = `<div>
<div class="params">
<div id="gold"></div>
</div>
<div class="${WONDER.textClass}"><text/></div>
<ul class="wonder-choices">
${WONDER.template.choices}
</ul>
</div>`;

// default CSS
const DEFAULT_CSS = [
    //language=CSS
        `body {
        margin: 0;
        padding: 0;
        background: #ceceb7;
        font-family: "Roboto", "Open Sans", sans-serif;
    }`,
    //language=CSS
    `.${WONDER.pageClass} {
          width: 800px;
          margin: 15px auto;
          padding: 12px;  
          background: beige;
          border: 1px solid #ab9963;
          border-radius: 8px;
        }`,

    //language=CSS
    `.${WONDER.textClass} {
        margin-bottom: 24px;
        margin-top: 48px;
        font-size: 18px;
        line-height: 1.2em;
    }`,

    //language=CSS
        `ul.wonder-choices {
        margin: 12px 0 0 0;
        padding: 0;
        list-style: none;
    }`,


    //language=CSS
    `.${WONDER.linkClass}{
        cursor: pointer;
        padding: 8px;
        background: #d3d5b1;
        margin-bottom: 8px;
        border-radius: 8px;
    }`,

    //language=CSS
    `.${WONDER.linkClass}:hover{
        text-decoration: underline;
        color: #313298;
    }`,


];
StyleInjector.bindStyles(DEFAULT_CSS);