const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const ConcatPlugin = require("webpack-concat-plugin");
const PACKAGE = require("./package");

const webpack = require('webpack');
const VERSION = ("" + PACKAGE.version).toLowerCase();
const REPO_URL = (PACKAGE.repository).toLowerCase();

const VERSION_INFO = `game version ${VERSION}`;
const VERSION_PATH = PACKAGE["versionPath"];

const SRC = path.join(__dirname, "src");
const DIST = path.join(__dirname, "dist" + "/" + VERSION_PATH);
const DIR_NODE = path.join(__dirname, "node_modules");

/**
 *  Можно держать кучу мини-игр в одном репо,
 *  если в папке src создавать директории под каждый
 */

const projects = [
    {
        src: "wonder-format",
        dist: "wonder",         // папка выгрузки в dist

        title: "Twine Wonder Format",
        htmlTemplate: "index.html",
        htmlDistrIndex: "index.html", // название html в папке дистрибутива
        entry: "start.ts",
        watch: true,
        copy: [
            "icon.svg"
        ]
    }
];

const entries = {};
const copyData = [];
const plugins = [];

// одним плагином задаем общие константы в файлах из entry point
plugins.push(new webpack.DefinePlugin({
    // передача происходит инлайнингом в исходники
    // если убрать JSON.stringify - то вместо "game version 1"
    // где-то в коде появится строка game version 1 без кавычек
    // (c) If the value is a string it will be used as a code fragment
    // и это ломает как минимум работу игры на webpack-dev-server
    VERSION_INFO: JSON.stringify(VERSION_INFO),
    REPO_URL: JSON.stringify(REPO_URL),
}));

projects.forEach((project) => {
    const dirSrc = path.join(SRC, project.src);
    // сборку старых игр осуществляем через склейку скриптов
    // entry есть у всех, кроме shared
    if (project.entry) {
        entries[project.dist] = path.join(dirSrc, project.entry);
    }

    /**
     *  Если есть htmlTemplate - используем ее
     */
    if (project.htmlTemplate && project.htmlTemplate.length > 0) {
        plugins.push(new HtmlPlugin({ // витально!
            template: path.join(dirSrc, project.htmlTemplate),
            filename: path.join(project.dist, project.htmlDistrIndex),
            // кастомные строки, которую можно передать в шаблон :
            title: project.title,
        }));
    }


    /**
     *  копирование директорие
     */
    project.copy.forEach((copyPath) => {
        copyData.push({from: `${project.src}/${copyPath}`, to: `${project.dist}/${copyPath}`});
    });
});
plugins.push(new CopyPlugin(copyData));

module.exports = (env, argv) => {
    return {
        context: SRC,
        entry: entries,
        mode: argv.mode || "development",
        target: "web",
        output: {
            path: DIST,
            filename: `[name]/[name].js`
        },
        devServer: {
            contentBase: "dist",
            disableHostCheck: true
        },
        resolve: {
            extensions: ['.ts', '.js'],
            modules: [
                SRC,
                DIR_NODE
            ]
        },
        module: {
            rules: [
                {test: /\.tsx?$/, loader: "ts-loader"},
            ],
        },

        plugins: plugins,
        // watch: false,
    };
};
