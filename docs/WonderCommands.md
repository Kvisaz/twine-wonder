# Команды Wonder

[Пользовательский скрипт](Scripts.md) JS может использовать методы объекта Wonder. Вместо `Wonder` можно использовать сокращенноё `w`.

## СSS
Подключить кастомный css из внешнего URL

`Wonder.styleUrl('mystyle.css');`

## Звуки и музыка

Просто запустить музыку в любой момент

`Wonder.music(url: string, volume = 1)`

Запустить музыку на локации `hashName`

`Wonder.musicFor(hashName: string, url: string, volume = 1`

Выключить музыку 
`Wonder.musicStop();`

По умолчанию музыка зациклена. Чтобы проиграть звуковой эффект без повторения
`Wonder.sound(url, volume);`



