const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const fg = require('fast-glob');
let Nunjucks = require("nunjucks");

const modulesUnstuctured = fg.sync('api/**', { onlyFiles: false, deep: 4, objectMode: true });

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("main.css");
    eleventyConfig.addPassthroughCopy("api");
    eleventyConfig.addPassthroughCopy("swagger");

    eleventyConfig.addPlugin(eleventyNavigationPlugin);


    /* 
        structure:
        {moduleName, productVersions: {
            productVersion, apiVersions: {
                apiVersion, file, path // swagger file
            }
        }}
    */
    let modulesStructured = new Map();
    modulesUnstuctured.forEach(({ name, path }) => {
        const category = path.split("/").length - 1; // if 1: module, if 2: product-version, if 3: api-version, 4: swagger file

        if (category == 1) {
            modulesStructured.set(name, { moduleName: name, productVersions: new Map() });
            return;
        }

        const moduleName = path.split("/")[1]

        if (category == 2) {
            modulesStructured.get(moduleName).productVersions.set(name, { productVersion: name, apiVersions: new Map() });
            return;
        }

        const productVersion = path.split("/")[2]
        const apiVersion = path.split("/")[3]

        if (category == 4) {
            modulesStructured.get(moduleName).productVersions.get(productVersion).apiVersions.set(apiVersion, { apiVersion: apiVersion, file: name, path: path });
            return;
        }
    });

    /*
        structured:
        [moduleName, lastProductVersion]
    */
    let modulePage = [];
    modulesStructured.forEach(({ moduleName, productVersions }) => {
        var lastProductVersion;
        productVersions.forEach(({ productVersion }) => {
            if (lastProductVersion == null) {
                lastProductVersion = productVersion;
            } else {
                if ((parseInt(productVersion[0]) > parseInt(lastProductVersion[0])) ||
                    ((parseInt(productVersion[0]) == parseInt(lastProductVersion[0])) && (parseInt(productVersion[2]) > parseInt(lastProductVersion[2])))) {
                    lastProductVersion = productVersion;
                }
            }
        });

        modulePage.push([moduleName, lastProductVersion]);
    })

    eleventyConfig.addCollection('modules', function (collection) {
        return modulePage;
    });

    /*
        structure:
        [moduleName, productVersion, lastApiVersion]
    */
    let productVersionPage = [];
    modulesStructured.forEach(({ moduleName, productVersions }) => {
        productVersions.forEach(({ productVersion, apiVersions }) => {
            let lastApiVersion;
            apiVersions.forEach(({ apiVersion }) => {
                if (lastApiVersion == null) {
                    lastApiVersion = apiVersion;
                } else {
                    if ((parseInt(apiVersion[4]) > parseInt(lastApiVersion[4])) ||
                        ((parseInt(apiVersion[4]) == parseInt(lastApiVersion[4])) && (parseInt(apiVersion[6]) > parseInt(lastApiVersion[6])))) {
                        lastApiVersion = apiVersion;
                    }
                }
            });
            productVersionPage.push([moduleName, productVersion, lastApiVersion]);
        });
    });

    eleventyConfig.addCollection('productVersions', function (collection) {
        return productVersionPage;
    });

    /*
        structure:
        [moduleName, productVersion, apiVersion, file]
    */
    let apiVersionPage = [];
    modulesStructured.forEach(({ moduleName, productVersions }) => {
        productVersions.forEach(({ productVersion, apiVersions }) => {
            apiVersions.forEach(({ apiVersion, file }) => {
                apiVersionPage.push([moduleName, productVersion, apiVersion, file]);
            });
        });
    });

    eleventyConfig.addCollection('apiVersions', function (collection) {
        return apiVersionPage
    });

    let nunjucksEnvironment = new Nunjucks.Environment(
        new Nunjucks.FileSystemLoader("_includes")
    );

    eleventyConfig.setLibrary("njk", nunjucksEnvironment);
}