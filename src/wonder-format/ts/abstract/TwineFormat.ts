/**
 *  Верхний класс, который должен передаваться в window.storyFormat
 *  чтобы инсталлировать формат в twine
 */
export class TwineFormat {
    name: string; // Короткое название SAMPLE: "Twison"
    version: string;    //   SAMPLE: "0.0.1"
    author: string;     //   SAMPLE: "Mike Lazer-Walker"
    description: string;     //   SAMPLE: "Export your Twine 2 story as a JSON document",
    proofing: boolean; // непонятно, в готовых дистрибутивах стоит false
    url: string; // ссылка на сайт, можно гитхаб
    image: string; // ссылка на картинку, в svg, относительно уже готового скрипта, 256 на 256 можно
    source: string; // html-код, со включенными скриптами и стилями - что будет использоваться как шаблон
}

/**
    Процесс сборки формата
    - скомпилить в .js
    - рядом с .js положить иконку

 */