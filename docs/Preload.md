# Preloader

Перед запуском игры может быть показана страница загрузки. Она оформляется с помощью CSS

```css
#preload {
        background: beige;
        color: #2a2003;
        font-size: larger;
    }

#preload .page {
    background: none;
}

#preload-anchor:before{
    content: 'Лорды проклятых земель';
    display: block;
    font-size: 32px;
}

#preload-anchor:after{
    content: 'Игра загружается...';
    display: block;
}
```

Обычно это просто пустая  страница, которая исчезает так быстро, что её не заметишь.

Это можно использовать для особых случаев.
