export interface IStartScreenOptions {
    newGame: string; // надпись на кнопке "Новая игра"
    continue: string; // надпись на кнопке продолжить
    continueOff: boolean; // отключить показ кнопки продолжения
    title: string;  // заголовок страницы, будет в теге h1
    text: string;   // текст страницы, будет в теге p и над кнопками
}
