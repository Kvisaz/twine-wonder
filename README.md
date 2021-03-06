# Wonder - Twine text quest format

Это открытый и бесплатный формат текстовых квестов для Twine. Особенности
- можно настраивать [картинки, фон и цвет каждой локации](docs/DESIGN.md)
- можно подключать [готовые темы оформления](format/templates/README.md) 
- ориентация на модульную работу с дизайном через CSS

Каждая локация в теге body получает уникальный id - это позволяет добавлять любое оформление для нужной локации через CSS.

## Последняя версия - 0.6.27
Большой адаптивный апдейт, нацеленный на мобилки.

## v 0.6.26
- демо-игра "Лорды Проклятых Земель" как пример
- коллекции: если в коллекции не предвидится вообще страниц (maxAmount==0), то коллекция удаляется перед стартом игры, чтобы не показывать бессмысленыне кнопки с нулями
- кнопки  выводятся как button, для скринридеров
- абзацы с переводами строк теперь оборачиваются в тег `<p>`

[Полный список изменений](docs/CHANGELOG.md)

## Установка 

Откройте Twine, нажмите "Форматы", затем "Добавить новый формат". Вставьте URL или полный путь к локальному файлу.

URL:
```html
https://kvisaz.github.io/twine-wonder/format/format/0.6.26/wonder.js
```

![Вставьте полный путь к файлу](docs/img/2020-02-07_184349.png)

Второй вариант - скачать и установить со своего компа:

## Установка из локального файла
Если не хотите зависеть от качества связи или доступности GitHub - рекомендую [скачать архив с форматом](format/format/0.6.26.zip), распаковать его в любую удобную папку на своем компьютере и указать при установке полный путь к файлу. К примеру, 
```html
D:\work\PLAYTEXT\wonder-format\0.6.26\wonder.js
```

Редактор Twine загружает кастомные форматы при запуске каждый раз - поэтому установка из локального файла, который лежит на вашем компьютере - гарантирует  стабильность проекта и его независимость от сети, внезапных апдейтов формата или доступности GitHub

## Документация
- [Кастомные скрипты](docs/Scripts.md)
- [Команды Wonder](docs/WonderCommands.md)
- [Save/Load](docs/SaveLoad.md)
- [Как сделать стартовую страницу](docs/StartPage.md)
- [Темы оформления](format/templates/README.md)
- [Как настроить фон и картинки в текстовом квесте](docs/DESIGN.md)
- [ChangeLog](docs/CHANGELOG.md)
