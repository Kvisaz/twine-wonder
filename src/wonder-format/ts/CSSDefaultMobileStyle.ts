import {WONDER} from './Constants';
import {CollectionCSS} from './twine-game/logic/collections/CollectionCSS';
import {GameMenuCSS} from './twine-game/logic/menu/GameMenuCSS';

//language=CSS
export const CSSDefaultMobileStyle= `

@media screen and (max-width: 1080px){
        #${WONDER.contentId} {
             width: 100%;
             margin: 78px 0 0;
             border-radius: 0;
        }
                
         .${CollectionCSS.list}, .${CollectionCSS.page} {
             width: 100%;
             margin: 0;
             border-radius: 0;
        }
        
         #${CollectionCSS.wrapperId}{
            position: absolute;
            display: flex;
            flex-direction: row;
            top: 0;
            left: 0;
          }
          
        .${CollectionCSS.button}{
            width: 96px;     
            line-height: 1em;
            background: antiquewhite;
            margin-right: 8px;
            margin-top: 0;
            box-shadow: none;
        }
        
        .kvisaz-dialog {
            width: 90%;
        }        
    }
    
    @media screen and (max-width: 1080px){ 
        .${CollectionCSS.button}{
            width: 96px;     
            line-height: 1em;
            background: antiquewhite;
            margin-right: 8px;
            margin-top: 0;
            box-shadow: none;
        }
    }
`;
