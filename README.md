# Wonder - Twine format

Последняя версия на сервере
- https://keeperofwonderland.com/tmp/v.0.0.1/wonder/wonderFormat.js


Я тут пилю свой твайн-формат, чтобы редактировать и понимать все.
Done
- конфиг через особые passages
- вывод параметров

## Документация
- [Изменить дизайн игры](docs/Design.md)
- [Twine Format](docs/TwineFormat.md)
- [Основа формата](docs/CoreFormat.md)
- [Переменные](docs/Params.md)
- [Скрипты](docs/Scripts.md)



##Todo!!
- специальные пассажи
    - wonder.css - свой стиль
    - wonder.html - вывод узла
    
- ВЫВОД ПАРАМЕТРОВ в params
- доработка линка
    - срабатывание скриптов только при нажатии а не при заходе (чтобы первый вход в шахту не генерил события)
    - показ линков при заданных условии    

- задать шаблон через wonder.html (css должен работать и тут)
- задать css через wonder.css
- ТЕСТ В TWINE

- изменение параметров только по клику на выборе (для шахт)
- сохранение состояний?

- первую историю-приключение

etc

## Special Nodes

Движок использует узлы с особыми названиями для хранения данных.

Первый базовый узел - `wonder.config`. Формат конфига - на каждой строке своя опция, типа
```text
uiParam : gold : #gold
```

## Параметры в UI
Параметры - создают параметры и инициализируют их. Можно привязать вывод параметров в шаблон.


Задаются через конфиг строчками
```text
var : gold : 0 : #gold
```
где
- : - разделитель
- uiParam - обязательное начало
- второй элемент - название параметра
- третий элемент - начальное значение
- четвертый элемент (необязательный) - CSS селектор для отображения параметра
