export class StyleInjector {
    protected static styleNode: HTMLStyleElement;

    protected static styleRules = {}; // кэш для проверки правил
    protected static fontFaces = {}; // кэш для проверки правил

    static bindStyles(styles: Array<string>) {
        if (styles == null || styles.length == 0) return;
        StyleInjector.checkStyleSheet();
        styles.forEach(StyleInjector.addStyleRule);
    }

    static addFontFace(fontFamilyName: string, fontUrl: string, fontFormat = "ttf") {
        // language=CSS
        const cssRule = `
        @font-face {
            font-family: "${fontFamilyName}";
            src: url("${fontUrl}") format("${fontFormat}");
        }`.trim();

        const isUnique = StyleInjector.fontFaces[fontFamilyName] == null;
        if (isUnique) {
            StyleInjector.addRule(cssRule);
            StyleInjector.fontFaces[fontFamilyName] = cssRule;
        } else {
            console.warn(`try to duplicate font-face: `, fontFamilyName);
        }
    }

    static addStyleRule(cssRule: string) {
        cssRule = cssRule.trim();
        if (cssRule.length == 0) {
            console.warn(`addUniqueRule get void rule`);
            return;
        }

        const isUnique = StyleInjector.isUniqueStyleRule(cssRule);
        if (isUnique) {
            StyleInjector.addRule(cssRule);
        } else {
            console.warn(`try to duplicate rule: `, cssRule);
        }
    }

    /**********
     * PRIVATE
     *********/

    private static checkStyleSheet() {
        if (StyleInjector.styleNode) return;

        StyleInjector.styleNode = document.createElement("style");
        document.head.appendChild(StyleInjector.styleNode);

        const sysMessage = document.createComment("app StyleInjector");
        StyleInjector.styleNode.appendChild(sysMessage);
    }


    private static addRule(rule: string) {
        StyleInjector.styleNode.appendChild(document.createTextNode(rule));
    }


    private static isUniqueStyleRule(rule: string, hash = StyleInjector.styleRules): boolean {

        const [selector, body] = rule.split(`{`).map(str => {
            str = str.replace('}', '');
            return str.trim()
        });

        let isUnique = hash[selector] == null;

        if (isUnique) {
            hash[selector] = body.replace('}', "");
        }

        return isUnique;
    }

}