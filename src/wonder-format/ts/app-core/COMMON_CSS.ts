import {StyleInjector} from "./StyleInjector";

export const COMMON_CSS = {
    displayNone: "displayNone",
    pointerOver: "pointerOver",
};

const defaultStyles = [
    //language=CSS
    `.${COMMON_CSS.displayNone} {display: none}`,
    //language=CSS
    `.${COMMON_CSS.pointerOver} {cursor: pointer}`,
];

StyleInjector.bindStyles(defaultStyles);