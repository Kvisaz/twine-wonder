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

## PostMessage API

Если игра запускается в iframe, то можно включить связь с родителем, обмен через postMessage.  Event.data в postMessage протоколе должен содержать поля
- name: название сообщения
- data: данные сообщения (необязательно)

Подписка на получение сообщения от родителя.
```
Wonder.parentApi().on('start', (state)=> {
    console.log('state: ', state);
});
```

Сохранить состояние.
```
Wonder.parentApi().send('save', state);
```




