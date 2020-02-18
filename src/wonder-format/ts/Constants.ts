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
    newLineClass: "newLine",
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

const REGEXP_ANY = '([\\s\\S]*?)';

// regexps
export const REGEXP = {
    exeScript: new RegExp('{{' + REGEXP_ANY + '}}', "g"),

    // /\[\[(.*?)\]\]/g - при переводе в строку удваивем  \
    twineLink: new RegExp('\\[\\[' + REGEXP_ANY + '\\]\\]', "g"),
};

// templates
export const PAGE_TEMPLATE = `<div class="${WONDER.noSelectClass} ${WONDER.pageClass}"></div>`;

export const LINK_TEMPLATE = `<span class="${WONDER.linkClass} ${WONDER.newLineClass}" data-id="${WONDER.template.choiceId}">${WONDER.template.choiceText}</span>`;

export const LINK_INLINE_TEMPLATE = `<span class="${WONDER.linkClass} " data-id="${WONDER.template.choiceId}">${WONDER.template.choiceText}</span>`

// done 0 скрипты через {{}}
// todo 1 произвольное создание параметров, инжектирование в params
// rejected 2 общий шаблон Passage-Template - конфликт display: none с flex
// done 3 flex css для page
export const PASSAGE_TEMPLATE = `<div class="${WONDER.pageContentClass}">
<div class="${WONDER.paramClass}" ><div id="gold"></div></div>
<div class="${WONDER.textClass}"><text/></div>
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
        
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .${WONDER.newLineClass} {
        display: block;
    }
    
   /* #goldMine1 {
        background: black;
    }
    
    #goldMine1 .text {
        background: beige;
        padding: 12px;
        margin-top: 400px;
    }
    
    #goldMine1 .page {
        font-family: monospace;
        background: url(img/image-castle-web.jpg) no-repeat;
        background-size: cover;
    }*/
    
    #${WONDER.contentId} {
        width: 800px;
        border-radius: 0 0 8px 8px;
        overflow: hidden;
    }
    
    .${WONDER.pageClass} {
          background: beige;          
     }
     
     .${WONDER.pageContentClass} {
          display: flex;
          flex-direction: column;
          padding: 12px;
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
        .${WONDER.contentId} {
             width: 100%;
             margin: 0;
             border-radius: 0;
        }
    }
`;
