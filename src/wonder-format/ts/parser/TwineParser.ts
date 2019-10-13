var anyString = '';
var aFunction = function () {
    return true;
};
var functionText = anyString + aFunction;

console.log(functionText);

function startParsing() {
    console.log(`Hello, it\`s Wonder parser`);

    const PASSAGE_SELECTOR = "tw-passagedata";

    const passagElCollection = document.querySelectorAll("PASSAGE_SELECTOR");
    const passageElemenst: Array<Element> = Array.prototype.slice.call(passagElCollection);

    passageElemenst.forEach(el => {
        console.log(`el.name ${el.getAttribute("name")}`);
        console.log(`el.content ${el.innerHTML}`);
    });
}

export function getParserCode(): string {
    return "(" + startParsing + ")()";
}