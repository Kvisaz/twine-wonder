# Twine Format

It is simple Javascript file like

```javascript
window.storyFormat({
    name: 'twine-wonder',
    version: '0.0.1',
    author: 'Kvisaz [Sergey Tokarev]',
    description: 'Twine Wonder Format',
    proofing: false,
    url: 'https://github.com',
    image: 'icon.svg',
    source: SOURCE,
});


var SOURCE = '{{STORY_DATA}}';
```

Source is power. Source is view and logic. 

## How to install Twine format
Use full path on your computer for local format file or url for remote format.

You can`t re-install same format with same version - so increment version or remove previous installed format.

## Source
Source is string that must contain special Twine command `{{STORY_DATA}}`, as you can see in example above. You can use only this command - and Twine export game as HTML-file like:

```html

<tw-storydata name="2019-10-12-clicker" startnode="1" creator="Twine" creator-version="2.3.2" ifid="0015E4DE-EEA5-4D56-A42F-0C1CAB51D81F" zoom="1" format="twine-wonder" format-version="0.0.1" options="debug" hidden>

    <style role="stylesheet" id="twine-user-stylesheet" type="text/twine-css"></style>
    <script role="script" id="twine-user-script" type="text/twine-javascript"></script>

    <tw-passagedata pid="1" name="somePassageName" tags="" position="723,830" size="100,100">
    Some passage description
    [[link text|anotherPassageName]]
    </tw-passagedata>

    <tw-passageda****ta pid="2" name="anotherPassageName" tags="" position="860,549" size="100,100">
    another Passage description
    
    [[link2 text|somePassageName]]
    </tw-passagedata>
</tw-storydata>
```

So, Twine generate for {{STORY_DATA}} :
- `tw-storydata` tag - common story data
- `style` tag - common user style sheet
- `script` tag - common user script 
- MULTIPLE `tw-passagedata` tags - all passages with links to other passages

Your format must convert this tags to any HTML5 application, what you want. Or to JSON to use in other game engines.

Just add some script to string `source` after `{{STORY_DATA}}`.

## Json Export 

Simple JSON exporter to textArea - [twine-to-json.js](json/twine-to-json.js)

Just download it and install from local path or your own server.
