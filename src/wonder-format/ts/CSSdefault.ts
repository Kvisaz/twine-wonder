import {CollectionCSS} from './twine-game/logic/collections/CollectionCSS';
import {WONDER} from './Constants';
import {GameMenuCSS} from './twine-game/logic/menu/GameMenuCSS';
import {CSSDefaultMobileStyle} from './CSSDefaultMobileStyle';

//language=CSS
export const DEFAULT_STYLE = `
     * {user-select: none;}
    .noselect { user-select: none; }    
    .select {  user-select: text; }
    .page .displayNone, .displayNone {
        display: none; 
    }
    
    tw-story, tw-storydata {
        display: none;
    }
    
    html, body{height: 100%}
    
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
        
    }
    
    #${WONDER.wrapperId}{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: start;
    }
    
    button {
        border: none;
        padding: 0;
        font-family: "Verdana", "Roboto", "Open Sans", sans-serif;
        cursor: pointer;
    }
    
    .${WONDER.shadowScreenClass} {
       position: absolute;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.3;
        top:0;
        left: 0;
    }
    
    .${WONDER.newLineClass} {
        display: block;
    }
    
    #${WONDER.contentId} {
        width: 800px;
        border-radius: 0 0 8px 8px;
        overflow: auto;
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
    }
    
    .${WONDER.textClass} p {
        margin: 1em 0;        
    }
    
    #${WONDER.startScreenId} .w-button {
        margin: 0 auto 1em; 
    }
    
    .${WONDER.linkClass}{
        display: block;
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
    
    #${WONDER.sideBarId}{
        display: flex;
        flex-direction: column;
    }
    
    #${WONDER.sideBarId} button {
        width: 96px;
        margin-right: 0;
        margin-top: 16px;
        box-shadow: none;
        border-radius: 0 8px 8px 0;
        border: 1px slategrey solid;
        overflow: hidden;
    }   
    
    #${WONDER.sideBarId} button:hover {
        transform: translateY(-2px);
    }
    
    .${CollectionCSS.button}{
        line-height: 1em;
        background: antiquewhite;
        text-align: center;
        box-shadow: 1px 2px 6px black;
    }
    
    .${CollectionCSS.buttonTitle}{
        font-size: 16px;
        text-align: center;
        height: 1em;
        line-height: 1em;
        background: #643903;
        color: #dedede;
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
        /*position: absolute;
        height: 89%;*/
        width: 800px;
        height: 100%;        
        /*top: 10%;
        left: 0;
        transform: translate(-110%, 0);*/
        background: beige;
       /* transition-duration: 0.45s;
        animation-timing-function: ease-out;*/
        box-shadow: 1px 2px 6px rgba(0,0,0,0.65);       
    }
    
    .kvisaz-createWindow-content {
        height: 100%;
        display: flex;
        flex-direction: column;  
    }
    
    .${CollectionCSS.list} .kvisaz-createWindow-content {
        padding: 12px;
        color: antiquewhite;
        background: #815f3d;   
    }
    
    .${CollectionCSS.listShow}{
        left: 50%;
        transform: translate(-49%, 0);
    }
    
    .${CollectionCSS.listHeader}{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
     }    
     
    .${CollectionCSS.listTitle}{
        font-size: 32px;
        margin: 2px;
     }
     
     .${CollectionCSS.listCloseButton}{
        border-radius: 8px;
        font-size: 12px;
        height: 32px;
        background: beige;
     }
        
    .${CollectionCSS.listContent}{        
        padding: 12px;
        background: #d7d7c5;
        color: black;
        border: 1px solid #afafaf;
        overflow: auto;
        flex: 1;
    }
    
    button.${CollectionCSS.listItem}{
         font-size: 24px;
         width: 100%;
         text-align: left;
         display: block;    
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
        height: 95%;
        width: 800px;        
        background: beige;
        box-shadow: 1px 2px 6px rgba(0,0,0,0.65);
    }
    
    .${CollectionCSS.page} h1{
        margin: 0;
    }
    
    .${CollectionCSS.page} .${WONDER.pageContentClass} {
        overflow: auto;
    }
    
    .${CollectionCSS.page} .${WONDER.backClass2} {
        position: absolute;
        right: 4px;
        top: 4px;
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
    
    #${GameMenuCSS.mainButtonId}{
        order: 0;
        background: #c6c3b2;
        width: 96px;
        height: 68px;
        display: flex;
        justify-content:center;
        align-items: center;
        padding: 0;
        margin: 0;
    }
    
    
    #${GameMenuCSS.mainButtonId} svg{
        
    }
    
    #${GameMenuCSS.mainButtonId} svg path{
        stroke: #534633;
        stroke-width: 2px;
        fill: #362e23;
        stroke-opacity: 0.5;
    }
    
    #${GameMenuCSS.mainButtonId} svg circle{
        fill: beige;
    }
    
    
    
    .${GameMenuCSS.mainButtonVisibleClass}:active{
         box-shadow:none;
         transform: translateY(2px);   
    }
    
    
    .${GameMenuCSS.mainButtonClassContent}{
    }
    
    .${GameMenuCSS.winClass}{
        
    }
    
    .kvisaz-createWindow button{
        min-width: 100px;
    }
    
    ${CSSDefaultMobileStyle}
`;
