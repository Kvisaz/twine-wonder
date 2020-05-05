# Wonder - Twine text quest format

Это открытый и бесплатный формат текстовых квестов для Twine. Особенности
- можно настраивать [картинки, фон и цвет каждой локации](docs/DESIGN.md)
- можно подключать [готовые темы оформления](format/templates/README.md) 
- ориентация на модульную работу с дизайном через CSS

Каждая локация в теге body получает уникальный id - это позволяет добавлять любое оформление для нужной локации через CSS.

## Последняя версия - 0.6.15
2020.05.04
- добавлены [теги](docs/Tags.md) как классы в линки на страницы;
- добавлены [Save/Loads](docs/SaveLoad.md)
- добавлены [переменные и скрипты JavaScript](docs/Scripts.md);

[Полный список изменений](docs/CHANGELOG.md)



## Установка 

Откройте Twine, нажмите "Форматы", затем "Добавить новый формат". Вставьте URL или полный путь к локальному файлу.

URL:
```html
https://kvisaz.github.io/twine-wonder/format/format/0.6.15/wonder.js
```

![Вставьте полный путь к файлу](docs/img/2020-02-07_184349.png)

Второй вариант - скачать и установить со своего компа:

## Установка из локального файла
Если не хотите зависеть от качества связи или доступности GitHub - рекомендую [скачать архив с форматом](format/format/0.6.15.zip), распаковать его в любую удобную папку на своем компьютере и указать при установке полный путь к файлу. К примеру, 
```html
D:\work\PLAYTEXT\wonder-format\0.6.15\wonder.js
```

Редактор Twine загружает кастомные форматы при запуске каждый раз - поэтому установка из локального файла, который лежит на вашем компьютере - гарантирует  стабильность проекта и его независимость от сети, внезапных апдейтов формата или доступности GitHub

## Документация
- [Команды Wonder](docs/WonderCommands.md)
- [Темы оформления](format/templates/README.md)
- [Как настроить фон и картинки в текстовом квесте](docs/DESIGN.md)
- [Кастомные скрипты](docs/Scripts.md)
- [ChangeLog](docs/CHANGELOG.md)
