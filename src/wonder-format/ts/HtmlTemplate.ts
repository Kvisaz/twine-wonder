export function createTwineSource(script: string, style = ""): string {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta charset="utf-8">
            <title>{{STORY_NAME}}</title>
            <style>${style}</style>
        </head>
        <body>
            <h1>Hello World!</h1>
            <tw-story tags></tw-story>
            {{STORY_DATA}}
            <script>
            ${script}
            </script>
        </body>
    </html>
    `;
}