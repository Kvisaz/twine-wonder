import {startParsing} from "./TwineParser";

export function testParser(scriptCode: string) {
    console.log(`testParser starting....`);

    // TODO билд парсера в отдельный скрипт и инжектинг его в html
    // конвертация в функцию не работает - вложенные функции не входят!
    /*   const script = document.createElement("script");
       script.innerHTML = scriptCode;
       document.body.appendChild(script)*/

    // пока тестируем так
    startParsing();
}