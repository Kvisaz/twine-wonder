// twine tags

import {CollectionCSS} from './runtime/collections/CollectionCSS';

export const STORY_SELECTOR = "tw-storydata";
export const PASSAGE_SELECTOR = "tw-passagedata";

export const COMMON_CSS = {
    displayNone: "displayNone",
    pointerOver: "pointerOver",
    visited: "visited",
    back: "back"

};

// wonder selector
export const WONDER = {
    contentId: "wonder-content",
    pageClass: "page",
    pageContentClass: "page-content",
    textClass: "text",
    choiceClass: "choice",
    linkClass: "link",
    linkAloneClass: "link-alone",
    newLineClass: "newLine",
    linkInlineClass: "inline",
    noSelectClass: "noselect",
    selectClass: "select",
    paramClass: 'params',
    visitedClass: COMMON_CSS.visited,
    backClass: COMMON_CSS.back,
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


const REGEXP_ANY = '([\\s\\S]*?)';

// regexps
export const REGEXP = {
    exeScript: new RegExp('{{' + REGEXP_ANY + '}}', "g"),

    // /\[\[(.*?)\]\]/g - при переводе в строку удваивем  \
    twineLink: new RegExp('\\[\\[' + REGEXP_ANY + '\\]\\]', "g"),
};

// templates
export const PAGE_TEMPLATE = `<div class="${WONDER.noSelectClass} ${WONDER.pageClass}"></div>`;

export const LINK_TEMPLATE = `<span class="${WONDER.linkClass}  ${WONDER.linkAloneClass}" data-id="${WONDER.template.choiceId}">${WONDER.template.choiceText}</span>`;

export const LINK_INLINE_TEMPLATE = `<span class="${WONDER.linkClass}" data-id="${WONDER.template.choiceId}">${WONDER.template.choiceText}</span>`

export const BACK_TEMPLATE = `<div class="${WONDER.backClass}">Назад</div>`;

// done 0 скрипты через {{}}
// todo 1 произвольное создание параметров, инжектирование в params
// rejected 2 общий шаблон Passage-Template - конфликт display: none с flex
// done 3 flex css для page
export const PASSAGE_TEMPLATE = `<div class="${WONDER.pageContentClass}">
${BACK_TEMPLATE}
<div class="${WONDER.paramClass}" ><div id="gold"></div></div>
<div class="${WONDER.textClass}"><text/></div>
</div>`;

//language=CSS
export const DEFAULT_STYLE = `
     * {user-select: none;}
    .noselect { user-select: none; }    
    .select {  user-select: text; }
    .page .displayNone, .displayNone {
        display: none; 
    }
    html, body{height: 100%}
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
        position: relative;
        display: flex;
        justify-content: center;
        align-items: start;
    }
    
    .${WONDER.newLineClass} {
        display: block;
    }
    
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
        line-height: 26px;
    }
    
    .${WONDER.linkClass}{
        display: block;
        cursor: pointer;
        padding: 5px 35px;
        border-radius: 5px;
        background: #d5c695;
    }
        
    .${WONDER.linkClass}:hover, .${WONDER.backClass}:hover{
        color: #4b0d1e;
        background: #d5b562;       
    }
    
    .${WONDER.visitedClass}:after {
        content: '  (прочитано)';
        font-size: smaller;
     }
     
     .${WONDER.visitedClass} {
        opacity: 0.65;
        font-size: smaller;
     }
    
    .${WONDER.backClass} {
        cursor: pointer;
        display: inline-block;
        margin-left: 0;
        margin-right: auto;
        margin-bottom: 4px;
        padding: 4px;
        border-radius: 5px;
        background: #eae2c5;
        color: #6c6c6c;
    }
    
     .${WONDER.backClass}:before {
        content: '<';
     }
   
    
    .${WONDER.linkAloneClass}{
        margin-top: 0px;
    }
    
    .${WONDER.linkAloneClass}:hover{
        margin-top: -2px;
        margin-bottom: 2px;
        box-shadow: 2px 2px 1px #414141;
    }
    
    #${CollectionCSS.wrapperId}{
        position: absolute;
        display: flex;
        flex-direction: column;
        top: 0;
        left: 0;
    }
    
    .${CollectionCSS.button}{
        width: 96px;     
        line-height: 1em;
        background: antiquewhite;
        margin-top: 24px;
        text-align: center;
        cursor: pointer;
        box-shadow: 1px 2px 6px black;
    }
    
    .${CollectionCSS.button}:hover {
        transform: scale(1.09) translateX(4px);
        box-shadow: 1px 2px 6px black;
    }
    
    .${CollectionCSS.buttonTitle}{
        font-size: 16px;
        text-align: center;
        height: 1em;
        line-height: 1em;
        background: #b66e13;
        margin-bottom: 12px;
        padding: 2px;
    }
    
    .${CollectionCSS.buttonContent}{
        font-size: 24px;
        text-align: center;
        height: 1em;
        line-height: 1em;
        margin-bottom: 12px;
    }
    
    .${CollectionCSS.list}{
        position: absolute;
        height: 90%;
        width: 800px;        
        top: 10%;
        left: 0;
        transform: translate(-100%, 0);
        background: beige;
        transition-duration: 0.45s;
        animation-timing-function: ease-out;
        box-shadow: 1px 2px 6px rgba(0,0,0,0.65);
    }
    
    .${CollectionCSS.listShow}{
        left: 50%;
        transform: translate(-54%, 0);
    }
    
    .${CollectionCSS.listTitle}{
        font-size: 32px;    
        margin: 12px;
     }
        
    .${CollectionCSS.listContent}{
        font-size: 24px;
        overflow: auto;
        height: 90%;
    }
    .${CollectionCSS.listItem}{ 
         margin: 12px;
         padding: 12px;
         border: 1px solid #afafaf;
         cursor: pointer;
    }
    
    .${CollectionCSS.listContent}::-webkit-scrollbar { width: 32px; }
        
    .${CollectionCSS.listContent}::-webkit-scrollbar-track {
        background: #d0ac75;
        border-radius: 16px;    
    }
    .${CollectionCSS.listContent}::-webkit-scrollbar-thumb {
          background-color: #f1760c;   
          border-radius: 20px;       
          border: 2px solid #6f3909; 
    }
    
    @media screen and (max-width: 800px){
        .${WONDER.contentId} {
             width: 100%;
             margin: 0;
             border-radius: 0;
        }
    }
`;
