var SOURCE = '<!DOCTYPE html>\n' +
    '    <html lang="ru">\n' +
    '        <head>\n' +
    '            <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '            <meta charset="utf-8">\n' +
    '            <title>{{STORY_NAME}}</title>\n' +
    '            <style>${style}</style>\n' +
    '        </head>\n' +
    '        <body>\n' +
    '            <tw-story tags></tw-story>\n' +
    '            {{STORY_DATA}}\n' +
    '            <script>' + ${script}+ '</script>' +
    '        </body>\n' +
    '    </html>';


window.storyFormat({
    name: '${name}',
    version: '${version}',
    author: '${author}',
    description: '${description}',
    proofing: false,
    url: '${repository}',
    image: '${icon}',
    source: SOURCE,
});
