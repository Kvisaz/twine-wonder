import {WONDER} from './Constants';
import {CollectionCSS} from './twine-game/logic/collections/CollectionCSS';

//language=CSS
export const CSSDefaultMobileStyle= `

@media screen and (max-width: 800px){
        .${WONDER.contentId} {
             width: 100%;
             margin: 0;
             border-radius: 0;
        }
                
         .${CollectionCSS.list}, .${CollectionCSS.page  } {
             width: 100%;
             margin: 0;
             border-radius: 0;
        }
        
         #${CollectionCSS.wrapperId}{
            position: absolute;
            display: flex;
            flex-direction: column;
            top: 0;
            left: 0;
          }
        
        
    }
`;
