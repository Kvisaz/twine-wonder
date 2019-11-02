// twine tags
import {StyleInjector} from "./app-core/StyleInjector";

export const STORY_SELECTOR = "tw-storydata";
export const PASSAGE_SELECTOR = "tw-passagedata";

// wonder selector
export const WONDER = {
    contentId: "wonder-content",
    pageClass: "page",
    textClass: "text",
    choiceClass: "choice",
    linkClass: "link",
    linkInlineClass: "inline",
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
    passages: {
        config: "wonder.config",
        // todo
        pageFormat: "wonder.format.page",
        choiceFormat: "wonder.format.choice",
        textFormat: "wonder.format.text",
    },
    markLang: {
        varStart: "var",
        commandSplitter: ":",
    },
    inlineStart: "="
};

// regexps
export const REGEXP = {
    exeScript: new RegExp("{{([\\s\\S]*?)}}", "g"),

    // /\[\[(.*?)\]\]/g - при переводе в строку удваивем  \
    twineLink: new RegExp("\\[\\[(.*?)\\]\\]", "g"),
};

// templates
export const PAGE_TEMPLATE = `<div class="${WONDER.noSelectClass} ${WONDER.pageClass}"></div>`;

export const LINK_TEMPLATE = `<div class="${WONDER.linkClass}" data-id="${WONDER.template.choiceId}">${WONDER.template.choiceText}</div>`;

export const LINK_INLINE_TEMPLATE = `<span class="${WONDER.linkClass} ${WONDER.linkInlineClass}" data-id="${WONDER.template.choiceId}">${WONDER.template.choiceText}</span>`

// done 0 скрипты через {{}}
// todo 1 произвольное создание параметров, инжектирование в params
// todo 2 общий шаблон Passage-Template
// todo 3 flex css для page
export const PASSAGE_TEMPLATE = `<div>
<div class="params" > 
<div id="gold"></div>
</div>
<div class="${WONDER.selectClass} ${WONDER.textClass}"><text/></div>
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
        -webkit-touch-callout: default; /* iOS Safari */
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
    
    .${WONDER.linkClass}{
        cursor: pointer;
        margin: 16px 0;
        text-decoration: underline;
    }
        
    .${WONDER.linkClass}:hover{
        color: #313298;
    }
`;