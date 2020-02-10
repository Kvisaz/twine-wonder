/**
 *  build node script
 *  use node twineFormatBuild.js formatTemplate scriptPath cssPath
 */

/*************************************
 *      node imports
 ************************************/

const fs = require("fs");
const Path = require("path");
const {zip} = require('zip-a-folder');

const CONFIG = require("./twineFormatBuild.json");
const PACKAGE = require("./package.json");

main();


/*************************************
 *      main
 ************************************/
async function main() {

    setVersionFolders();

    const fileFormatFrom = Path.resolve(CONFIG.src.dir, PACKAGE.bundleScript);
    const fileFormatTo = Path.resolve(CONFIG.out.dir, CONFIG.out.format);

    if (noExist(fileFormatFrom)) {
        console.log(`ERROR: no file at `, fileFormatFrom);
        return;
    }

    const templateContent = getFileContent(Path.resolve(CONFIG.src.dir, CONFIG.src.format));

    const formatContent = buildTwineFormat(fileFormatFrom, templateContent);

    saveFileContent(fileFormatTo, formatContent);

    copyIcon();

    const zipName = CONFIG.out.dir + ".zip";
    await zip(CONFIG.out.dir, zipName);

    console.log("success....");
}

/*************************************
 *      main functions
 ************************************/

function setVersionFolders() {
    CONFIG.src.dir = CONFIG.src.dir.replace(CONFIG.marker.version, PACKAGE.version);
    CONFIG.out.dir = CONFIG.out.dir.replace(CONFIG.marker.version, PACKAGE.version);

    if (noExist(CONFIG.out.dir)) fs.mkdirSync(CONFIG.out.dir);
}

function buildTwineFormat(srcFile, templateContent) {
    const scriptContent = getFileContent(srcFile)
        .replace(CONFIG.marker.version, PACKAGE.version);

    const stringedScript = JSON.stringify(scriptContent);

    const styleContent = getFileContent(CONFIG.src.style);

    const formatContent = templateContent
        .replace(CONFIG.marker.style, styleContent)
        .replace(CONFIG.marker.script, stringedScript)
        .replace(CONFIG.marker.name, PACKAGE.name)
        .replace(CONFIG.marker.author, PACKAGE.author)
        .replace(CONFIG.marker.version, PACKAGE.version)
        .replace(CONFIG.marker.description, PACKAGE.description)
        .replace(CONFIG.marker.repository, PACKAGE.repository)
        .replace(CONFIG.marker.icon, PACKAGE.icon);

    return formatContent;
}

function copyIcon() {
    const iconFrom = Path.resolve(CONFIG.src.dir, PACKAGE.icon);
    const iconTo = Path.resolve(CONFIG.out.dir, CONFIG.out.icon);
    copy(iconFrom, iconTo);
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

/***
 *   COPY FILES
 * */

function readDir(dir) {
    return fs.readdirSync(dir);
}

function isFile(fileName) {
    return !fs.lstatSync(fileName).isDirectory();
}

function copy(source, target) {
    if (isFile(source)) copyFile(source, target);
    else copyDir(source, target);
}

function copyFile(source, target) {
    fs.copyFileSync(source, target);
}

function copyDir(source, target) {
    if (noExist(target)) fs.mkdirSync(target);

    const filesInDir = readDir(source);
    for (let i = 0; i < filesInDir.length; i++) {
        const nextSource = Path.join(source, filesInDir[i]);
        const nextTarget = Path.join(target, filesInDir[i]);
        if (isFile(nextSource)) copyFile(nextSource, nextTarget);
        else copyDir(nextSource, nextTarget);
    }
};
