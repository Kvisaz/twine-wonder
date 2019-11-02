// twine tags

export const STORY_SELECTOR = "tw-storydata";
export const PASSAGE_SELECTOR = "tw-passagedata";

// wonder selector
export const WONDER = {
    contentId: "wonder-content",
    pageClass: "page",
    pageContentClass: "page-content",
    textClass: "text",
    choiceClass: "choice",
    linkClass: "link",
    linkInlineClass: "inline",
    noSelectClass: "noselect",
    selectClass: "select",
    paramClass: 'params',
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
    inlineStart: "=",

};

export const COMMON_CSS = {
    displayNone: "displayNone",
    pointerOver: "pointerOver",
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
// rejected 2 общий шаблон Passage-Template - конфликт display: none с flex
// done 3 flex css для page
export const PASSAGE_TEMPLATE = `<div class="${WONDER.pageContentClass}">
<div class="${WONDER.paramClass}" ><div id="gold"></div></div>
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
    
    .page .displayNone, .displayNone {
        display: none; 
    }
    
    .pointerOver {
        cursor: pointer;
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
     
     .${WONDER.pageContentClass} {
          display: flex;
          flex-direction: column;
     }
        
    .${WONDER.paramClass}{
        margin-bottom: 12px;
    }
        
        
    .${WONDER.textClass} {
        margin: 0;
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
    
    @media screen and (max-width: 800px){
        .${WONDER.pageClass} {
             width: 100%;
             margin: 0;
             border-radius: 0;
        }
    }
`;
