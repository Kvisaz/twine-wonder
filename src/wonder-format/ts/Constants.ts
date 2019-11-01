// twine tags
import {StyleInjector} from "./app-core/StyleInjector";

export const STORY_SELECTOR = "tw-storydata";
export const PASSAGE_SELECTOR = "tw-passagedata";

// wonder selector
export const WONDER = {
    contentId: "wonder-content",
    pageClass: "page",
    textClass: "text",
    choicesClass: "choices",
    choiceClass: "choice",
    linkClass: "link",
    noSelectClass: "noselect",
    selectClass: "select",
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
    exeScript: new RegExp("<w>([\\s\\S]*?)<\/w>", "g"),

    // /\[\[(.*?)\]\]/g - при переводе в строку удваивем  \
    twineLink: new RegExp("\\[\\[(.*?)\\]\\]", "g"),
};

// templates
export const PAGE_TEMPLATE = `<div class="${WONDER.noSelectClass} ${WONDER.pageClass}"></div>`;

export const LINK_TEMPLATE = `<li class="${WONDER.linkClass}" data-id="${WONDER.template.choiceId}">${WONDER.template.choiceText}</li>`;

export const PASSAGE_TEMPLATE = `<div>
<div class="params" > 
<div id="gold"></div>
</div>
<div class="${WONDER.selectClass} ${WONDER.textClass}"><text/></div>
<ul class="${WONDER.choicesClass}">
${WONDER.template.choices}
</ul>
</div>`;

//language=CSS
export const DEFAULT_STYLE = `

    .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
    }
    
    .select {
        -webkit-touch-callout: text; /* iOS Safari */
        -webkit-user-select: text; /* Safari */
        -khtml-user-select: text; /* Konqueror HTML */
        -moz-user-select: text; /* Old versions of Firefox */
            -ms-user-select: text; /* Internet Explorer/Edge */
                user-select: text; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
    }
    
    ul, li {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    
    body {
        margin: 0;
        padding: 0;
        background: #ceceb7;
        font-family: "Verdana", "Roboto", "Open Sans", sans-serif;
    }
    
    .${WONDER.pageClass} {
          width: 800px;
          margin: 15px auto;
          padding: 12px;  
          background: beige;
          border-radius: 8px;
        }
        
        
    .${WONDER.textClass} {
        margin-bottom: 24px;
        margin-top: 48px;
        font-size: 18px;
        line-height: 1.2em;
    }
    
    .${WONDER.choicesClass} {
        margin: 12px 0 0 0;
        padding: 0;
        list-style: none;
    }
    
    .${WONDER.linkClass}{
        cursor: pointer;
        margin-bottom: 16px;
        border-radius: 8px;
        text-decoration: underline;
    }
        
    .${WONDER.linkClass}:hover{
        color: #313298;
    }
`;