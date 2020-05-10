export interface IPreprocessRule {
    tag: string;        // тег
    text: string;       // текст который надо добавить
    text2?: string;     // второй текст который надо добавить
    position: PreprocessPosition;    //  куда добавить
}

export interface IPreprocessRuleMap {
    [tag: string]: Array<IPreprocessRule>
}

export const enum PreprocessPosition {
    start = "start",
    end = "end",
    around = "around"
}
