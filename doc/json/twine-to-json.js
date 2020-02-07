var script = "function exportToJson() {\n" +
    "    var storyEl = document.querySelector('tw-storydata');\n" +
    "\n" +
    "    var story = {};\n" +
    "    for (var i = 0, attrs = storyEl.attributes, n = attrs.length; i < n; i++){\n" +
    "        story[attrs[i].name] = attrs[i].value;\n" +
    "    }\n" +
    "\n" +
    "    story.style = document.querySelector('#twine-user-stylesheet').innerHTML;\n" +
    "    story.script = document.querySelector('#twine-user-script').innerHTML;\n" +
    "\n" +
    "    var passagesEls =  Array.prototype.slice.call(storyEl.querySelectorAll('tw-passagedata'));\n" +
    "\n" +
    "    story.passages = passagesEls.map(function (passageEl) {\n" +
    "        var passage = {};\n" +
    "        for (var i = 0, attrs = passageEl.attributes, n = attrs.length; i < n; i++){\n" +
    "            passage[attrs[i].name] = attrs[i].value;\n" +
    "        }\n" +
    "        passage.content = passageEl.innerHTML;\n" +
    "        return passage;\n" +
    "    });\n" +
    "\n" +
    "    var json = JSON.stringify(story);\n" +
    "\n" +
    "    var textArea = document.createElement('textarea');\n" +
    "    textArea.innerHTML = json;\n" +
    "    textArea.style.width = '100%';\n" +
    "    textArea.style.height= '400px';\n" +
    "    document.body.appendChild(textArea);\n" +
    "}";


var SOURCE = '{{STORY_DATA}} <script>' + script + '; exportToJson()</script>';


window.storyFormat({
    name: 'twine-json',
    version: '0.0.1',
    author: 'Kvisaz [Sergey Tokarev]',
    description: 'Twine Json Format',
    proofing: false,
    url: 'https://github.com',
    image: 'icon.svg',
    source: SOURCE,
});