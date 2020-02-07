/**
 *  build node script
 *  use node twineFormatBuild.js formatTemplate scriptPath cssPath
 */

/*************************************
 *      node imports
 ************************************/

const fs = require("fs");
main();

/*************************************
 *      main
 ************************************/
function main() {
    const CONFIG = getJSONContent("twineFormatBuild.json");

    const PACKAGE = getJSONContent("package.json");

    const VERSION = PACKAGE["version"];

    const BUNDLE_SCRIPT = PACKAGE['bundleScript'];


    CONFIG.src.script = CONFIG.src.script.replace(CONFIG.marker.version, VERSION);
    CONFIG.src.script = CONFIG.src.script.replace(CONFIG.marker.bundleScript, BUNDLE_SCRIPT);

    CONFIG.output = CONFIG.output.replace(CONFIG.marker.version, VERSION);
    CONFIG.output = CONFIG.output.replace(CONFIG.marker.version, VERSION);


    if (noExist(CONFIG.src.script)) {
        console.log(`ERROR: no file at `, CONFIG.src.script);
        return;
    }

    const scriptContent = getFileContent(CONFIG.src.script)
        .replace(CONFIG.marker.version, PACKAGE.version);

    const stringedScript = JSON.stringify(scriptContent);

    const styleContent = getFileContent(CONFIG.src.style);
    const templateContent = getFileContent(CONFIG.src.format);

    const formatContent = templateContent
        .replace(CONFIG.marker.style, styleContent)
        .replace(CONFIG.marker.script, stringedScript)
        .replace(CONFIG.marker.name, PACKAGE.name)
        .replace(CONFIG.marker.author, PACKAGE.author)
        .replace(CONFIG.marker.version, PACKAGE.version)
        .replace(CONFIG.marker.description, PACKAGE.description)
        .replace(CONFIG.marker.repository, PACKAGE.repository)
        .replace(CONFIG.marker.icon, PACKAGE.icon)

    saveFileContent(CONFIG.output, formatContent);

    console.log("success....");
}

/*************************************
 *      node functions
 ************************************/

/**
 * @return {string[]}
 */
function getAllCommandArgs() {
    return process.argv;
}

/**
 * @return {string[]}
 */
function getScriptCommandArgs() {
    return getAllCommandArgs().slice(2);
}

/** file functions **/

function noExist(fileName) {
    return !fs.existsSync(fileName);
}


/**
 * getFileContent
 * @param filename
 * @param encoding
 * @return {string}
 */
function getFileContent(filename, encoding) {
    encoding = encoding || "utf-8";
    const isExist = fs.existsSync(filename);
    const content = isExist
        ? fs.readFileSync(filename, {encoding: encoding})
        : "";
    return content;
}

function getJSONContent(filename) {
    return JSON.parse(getFileContent(filename));
}

/**
 *
 * @param fileName
 * @param content
 * @param encoding
 */
function saveFileContent(fileName, content, encoding) {
    encoding = encoding | "utf-8";
    fs.writeFileSync(fileName, content, {encoding: encoding});
}
