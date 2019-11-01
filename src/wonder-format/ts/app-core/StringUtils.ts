export class StringUtils {
    // 'kebab-case' => 'kebabCase'
    kebabToCamel(str: string): string {
        const arr = str.split('-');
        let capital = arr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item);
        // ^-- change here.
        let capitalString = capital.join("");

        return capitalString;
    }
}