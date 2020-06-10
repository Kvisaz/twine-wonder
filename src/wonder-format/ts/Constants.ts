// twine tags

import {CollectionCSS} from './twine-game/logic/collections/CollectionCSS';
import {GameMenuCSS} from './twine-game/logic/collections/menu/GameMenuCSS';

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
    shadowScreenClass: 'scr-shadow',
    preloadId: 'preload',
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

export const BT_START_TEMPLATE = `<button id="${WONDER.replace.button.id}" class="${WONDER.buttonClass}" data-command="${WONDER.replace.button.command}">${WONDER.replace.button.label}</button>`;

// done 0 скрипты через {{}}
// todo 1 произвольное создание параметров, инжектирование в params
// rejected 2 общий шаблон Passage-Template - конфликт display: none с flex
// done 3 flex css для page
export const PASSAGE_TEMPLATE = `<div class="${WONDER.pageContentClass}">
<div class="${WONDER.paramClass}" ><div id="gold"></div></div>
<div class="${WONDER.textClass}"><text/>${BACK_TEMPLATE}</div>
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
    
    h1:first-letter, .${WONDER.textClass} p:first-letter { text-transform: uppercase; }
    h1::first-letter, .${WONDER.textClass} p::first-letter { text-transform: uppercase; }
    
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
    
    button {
        border: none;
        font-family: "Verdana", "Roboto", "Open Sans", sans-serif;
    }
    
    .${WONDER.shadowScreenClass} {
       position: absolute;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.3;
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
     
     #${WONDER.preloadId} .${WONDER.pageClass} {
        background: none;
     }
     
     .${WONDER.pageContentClass} {
          display: flex;
          flex-direction: column;
          padding: 12px;
     }
        
    .${WONDER.paramClass}{
        margin-bottom: 12px;
    }        
        
    .${WONDER.textClass}, .${WONDER.textClass} button {
        margin: 0;
        font-size: 18px;
        line-height: 26px;
    }
    
    .${WONDER.textClass} p {
        margin: 1em 0;
    }
    
    #${WONDER.startScreenId} button {
        margin: 0 auto 1em; 
    }
    
    .${WONDER.linkClass}{
        display: block;
        cursor: pointer;
        padding: 5px 35px;
        border-radius: 5px;
        background: #d5c695;
    }   
        
    .${WONDER.inlineClass} .${WONDER.linkClass}{
        display: inline;
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
        padding: 5px 35px 5px 17px;
        border-radius: 5px;
        background: #eae2c5;
        color: #6c6c6c;
    }
    
     .${WONDER.backClass}:before {
        content: '<';
     }
     
     .${WONDER.buttonClass} {
        cursor: pointer;
        display: block;
        margin: 4px auto 0.65em;
        width: 12em;
        text-align: center;
        background: #c6c3b2;
        padding: 12px;
        text-transform: uppercase;
        transition:all 0.21s ease-out;
     }
     
     .${WONDER.pressedClass}{
        opacity: 0.55;
        cursor: auto;
     }
    
    .${WONDER.buttonClass}:not(.${WONDER.pressedClass}):active {
        transform: translateY(0.15em);
    }
    
    .${WONDER.linkAloneClass}{
        margin-top: 0px;
    }
    
    .${WONDER.linkAloneClass}:hover{
        transform: translateY(-2px);
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
        height: 89%;
        width: 800px;        
        top: 10%;
        left: 0;
        transform: translate(-100%, 0);
        background: #876b38;
        transition-duration: 0.45s;
        animation-timing-function: ease-out;
        box-shadow: 1px 2px 6px rgba(0,0,0,0.65);
    }
    
    .${CollectionCSS.listShow}{
        left: 50%;
        transform: translate(-49%, 0);
    }
    
    .${CollectionCSS.listTitle}{
        font-size: 32px;    
         color: antiquewhite;   
        margin: 12px;
     }
        
    .${CollectionCSS.listContent}{
        font-size: 24px;
        overflow: auto;
        padding: 12px;
        background: #d7d7c5;
        border: 1px solid #afafaf;
        height: 90%;
    }
    .${CollectionCSS.listItem}{ 
         padding: 12px;
         border: 1px solid #afafaf;
         cursor: pointer;
         background: beige;
         border-radius: 4px;
         margin-top: 6px;
    }
    
    .${CollectionCSS.listItem}:hover {
        transform: scale(1.01);
        background: #fffffc;
        box-shadow: 1px 2px 6px rgba(0,0,0,0.65);
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
    
    .${CollectionCSS.page}{
        position: absolute;
        height: 95%;
        width: 800px;        
        top: 3%;
        left: 0;
        transform: translate(-100%, 0);        
        background: beige;
        overflow: auto;
        transition-duration: 0.45s;
        animation-timing-function: ease-out;
        box-shadow: 1px 2px 6px rgba(0,0,0,0.65);
    }
    
    .${CollectionCSS.pageContent}{
        margin: 12px 12px 16px;
    }
    
    .${CollectionCSS.pageShow}{
        left: 50%;
        transform: translate(-47%, 0);
    }
    
    .${CollectionCSS.page}::-webkit-scrollbar { width: 32px; }
        
    .${CollectionCSS.page}::-webkit-scrollbar-track {
        background: #d0ac75;
        border-radius: 16px;    
    }
    .${CollectionCSS.page}::-webkit-scrollbar-thumb {
          background-color: #ce9643;   
          border-radius: 20px;       
          border: 2px solid #efd0a6; 
    }
    
    .${GameMenuCSS.mainButtonClass}{
        font-size: 24px;
        position: fixed;
        background: #c6c3b2;
        cursor: pointer;    
        top: -132px;
        right: -132px;
        transform: scale(0.1);
        transition:all 0.21s ease-out;
        width: 132px;
        height: 132px;
        box-shadow: -2px 2px 6px rgba(0,0,0,0.5);   
        border-radius: 0px 0px 0px 128px;
    }
    
    .${GameMenuCSS.mainButtonVisibleClass}{
        top: -4px;
        right: -4px;
        transform: scale(1);
    }
    
    .${GameMenuCSS.mainButtonClass} svg{
        position: absolute;
        left: 44px;
        bottom: 44px;
        width: 64px;
        height: 64px;
    }
    
    .${GameMenuCSS.mainButtonClass} svg path{
        stroke: #534633;
        stroke-width: 2px;
        fill: #362e23;
        stroke-opacity: 0.5;
    }
    
    .${GameMenuCSS.mainButtonClass} svg circle{
        fill: beige;
    }
    
    
    
    .${GameMenuCSS.mainButtonVisibleClass}:active{
         box-shadow:none;
         transform: translateY(2px);   
    }
    
    
    .${GameMenuCSS.mainButtonClassContent}{
    }
    
    .${GameMenuCSS.winClass}{
        position: absolute;
        height: 95%;
        width: 800px;        
        top: 3%;
        right: 0;
        transform: translate(-100%, 0);        
        background: beige;
        overflow: auto;
        transition-duration: 0.45s;
        animation-timing-function: ease-out;
        box-shadow: 1px 2px 6px rgba(0,0,0,0.65);
    }
    
    .${GameMenuCSS.winVisibleClass}{
        left: 50%;
        transform: translate(-52%, 0);
    }
    
    .${GameMenuCSS.winButtonClass}{
        cursor: pointer;    
        background: #5D7CC8;
        width: 300px;
        height: 125px;
    }
    
    @media screen and (max-width: 800px){
        .${WONDER.contentId} {
             width: 100%;
             margin: 0;
             border-radius: 0;
        }
    }
`;
