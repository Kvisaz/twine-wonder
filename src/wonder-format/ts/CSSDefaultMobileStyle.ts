import {WONDER} from './Constants';
import {CollectionCSS} from './twine-game/logic/collections/CollectionCSS';
import {GameMenuCSS} from './twine-game/logic/menu/GameMenuCSS';

//language=CSS
export const CSSDefaultMobileStyle = `

@media screen and (max-width: 1080px){

    body {
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }
    
    #${WONDER.wrapperId}{
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }
    
    #${WONDER.sideBarId}{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        top: 0;
        left: 0;
      }
      
    #${WONDER.sideBarId} button {
        width: 96px;
        height: 72px;
        margin-right: 8px;
        margin-top: 0;
        margin-bottom: 8px;
        border-radius: 8px;
        box-shadow: none;
    }    
            
    #${WONDER.contentId} {
         width: 100%;
         margin: 0;
         border-radius: 0;
    }
            
    .${CollectionCSS.list}, .${CollectionCSS.page} {
         width: 100%;
         margin: 0;
         border-radius: 0;
    }
        
         
            
        .kvisaz-dialog {
            width: 90%;
        }        
    }

@media screen and (max-width: 640px){
    .${CollectionCSS.buttonTitle} {
        font-size: 14px;
    }  
    .${CollectionCSS.buttonContent} {
        font-size: 14px;
    }  
    
    #${WONDER.sideBarId} button {
        width: 64px;
        height: 64px;
    }       
 
}
  
`;
