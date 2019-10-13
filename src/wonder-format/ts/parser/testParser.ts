export function testParser(scriptCode:string) {
    console.log(`testParser starting....`);
    const script = document.createElement("script");
    script.innerHTML = scriptCode;
    document.body.appendChild(script)
}