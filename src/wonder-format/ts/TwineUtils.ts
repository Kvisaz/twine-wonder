import {TwineFormat} from "./abstract/TwineFormat";

export function installTwineFormat(config: TwineFormat) {
    console.table(config);

    try {
        // @ts-ignore
        window.storyFormat(config);
    } catch (e) {
        console.log(`window.storyFormat error`);
        console.log(e);
    }
}