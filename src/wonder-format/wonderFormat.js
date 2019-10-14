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


var SOURCE = '<!DOCTYPE html>\n' +
    '    <html>\n' +
    '        <head>\n' +
    '            <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '            <meta charset="utf-8">\n' +
    '            <title>{{STORY_NAME}}</title>\n' +
    '            <style>${style}</style>\n' +
    '        </head>\n' +
    '        <body>\n' +
    '            <h1>Hello World!</h1>\n' +
    '            <tw-story tags></tw-story>\n' +
    '            {{STORY_DATA}}\n' +
    '            <script>\n' +
    '            ${script}\n' +
    '            </script>\n' +
    '        </body>\n' +
    '    </html>';