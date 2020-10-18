const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const fg = require('fast-glob');
const fs = require('fs');
let Nunjucks = require("nunjucks");
const eleventyPluginTOC = require( '@thedigitalman/eleventy-plugin-toc-a11y' );
const markdownIt = require( 'markdown-it' );
const markdownItAnchor = require( 'markdown-it-anchor' );
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { exit } = require("process");

//const modulesUnstuctured = fg.sync('api/**', { onlyFiles: false, deep: 4, objectMode: true });
const moduleFiles = fg.sync('api/**', { onlyFiles: true, deep: 4, objectMode: true });
const moduleDicts = fg.sync('api/**', { onlyDirectories: true, deep: 4, objectMode: true });

//const name = fg.sync('name.json', {objectMode: true});
module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("main.css");
    eleventyConfig.addPassthroughCopy("swagger");

    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // TOC support in MD

    eleventyConfig.addPlugin( eleventyPluginTOC,
        {
            tags: ['h2', 'h3', 'h4', 'h5', 'h6'],
            wrapper: 'nav',
            wrapperClass: 'toc',
            heading: true,
            headingClass: 'toc__heading',
            headingLevel: 'h2',
            headingText: 'Table of contents',
            listType: 'ol',
            listClass: 'toc__list',
            listItemClass: 'toc__list-item',
            listItemAnchorClass: 'toc__list-item-anchor'
        }
    );

    eleventyConfig.addPlugin(syntaxHighlight);
 
    // Markdown settings
    eleventyConfig.setLibrary( 'md',
        markdownIt().use( markdownItAnchor )
    );
    
    /* 
        {moduleName, productVersions: {
            productVersion, apiVersions: {
                apiVersion 
            }
        }}
    */
    var modulesStructured = new Map();
    moduleDicts.forEach(({ name, path }) => {
        const category = path.split("/").length - 1; // if 1: module, if 2: product-version

        if (category == 1) {
            modulesStructured.set(name, { moduleName: name, productVersions: new Map() });
            return;
        }

        const moduleName = path.split("/")[1];

        if (category == 2) {
            modulesStructured.get(moduleName).productVersions.set(name, { productVersion: name, apiVersions: new Map() });
            return;
        }
    });

    let displayNames = new Map();
    let info = new Map();
    moduleFiles.forEach(({name, path}) => {
        console.log("name path moduleFiles", name, path);
        const type = path.split("/").length - 1; // if 2: module.json (display name), if 4: swagger.json
        console.log("type", type);
        const moduleName = path.split("/")[1];
        console.log("moduleName", moduleName);
        if (type == 2) {
            var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
            displayNames.set(moduleName, obj.name);
            info.set(moduleName, obj.info);
            //console.log(obj.info, info)
        }
        
        const productVersion = path.split("/")[2];
        const apiVersion = path.split("/")[3];

        if (type == 4) {
            modulesStructured.get(moduleName).productVersions.get(productVersion).apiVersions.set(apiVersion, { apiVersion: apiVersion, file: name, path: path });
            return;
        }
    });

    /*
        structured:
        [moduleName, displayName, lastProductVersion]
    */
    let modulePage = [];
    /*
        structure:
        [moduleName, productVersion, lastApiVersion]
    */
   let productVersionPage = [];
   /*
        structure:
        [moduleName, displayModule, productVersion, apiVersion, file]
    */
    let apiVersionPage = [];


    modulesStructured.forEach(({ moduleName, productVersions }) => {
        var lastProductVersion;
        var productVersionJson = "{ \"productVersions\": [";
        productVersions.forEach(({ productVersion, apiVersions }) => {
            var lastApiVersion;
            var apiVersionJson = "{ \"apiVersions\": [";
            productVersionJson = productVersionJson + "\"" + productVersion + "\",";
            if (lastProductVersion == null) {
                lastProductVersion = productVersion;
            } else {
                if ((parseInt(productVersion[0]) > parseInt(lastProductVersion[0])) ||
                    ((parseInt(productVersion[0]) == parseInt(lastProductVersion[0])) && (parseInt(productVersion[2]) > parseInt(lastProductVersion[2])))) {
                    lastProductVersion = productVersion;
                }
            }
            apiVersions.forEach(({ apiVersion, file }) => {
                apiVersionJson = apiVersionJson + "\"" + apiVersion + "\",";
                if (lastApiVersion == null) {
                    lastApiVersion = apiVersion;
                } else {
                    if ((parseInt(apiVersion[4]) > parseInt(lastApiVersion[4])) ||
                        ((parseInt(apiVersion[4]) == parseInt(lastApiVersion[4])) && (parseInt(apiVersion[6]) > parseInt(lastApiVersion[6])))) {
                        lastApiVersion = apiVersion;
                    }
                }
                apiVersionPage.push([moduleName, displayNames.get(moduleName), productVersion, apiVersion, file]);
            });
            if (lastApiVersion == null) {
                console.log("Error with API version");
                exit(1);
            }
            productVersionPage.push([moduleName, productVersion, lastApiVersion]);
            lastApiVersion = null;
            apiVersionJson = apiVersionJson.slice(0, -1);
            apiVersionJson = apiVersionJson + "]}";
            fs.writeFile("api/" + moduleName + "/" + productVersion + "/apiVersions.json", apiVersionJson, function(err, result) {
                if(err) console.log('error', err);
            });
        });
        if (lastProductVersion == null) {
            console.log("Error with product version");
            exit(1);
        }
        productVersionJson = productVersionJson.slice(0, -1);
        productVersionJson = productVersionJson + "]}";
        fs.writeFile("api/" + moduleName + "/productVersions.json", productVersionJson, function(err, result) {
            if(err) console.log('error', err);
        });
        modulePage.push([moduleName, displayNames.get(moduleName), lastProductVersion, info.get(moduleName) || ""]);
        //console.log([moduleName, displayNames.get(moduleName), lastProductVersion, info.get(moduleName) || ""])
    });

    eleventyConfig.addCollection('modules', function (collection) {
        return modulePage;
    });
    eleventyConfig.addCollection('productVersions', function (collection) {
        return productVersionPage;
    });
    eleventyConfig.addCollection('apiVersions', function (collection) {
        return apiVersionPage;
    });




    
    eleventyConfig.addPassthroughCopy("api");



    let nunjucksEnvironment = new Nunjucks.Environment(
        new Nunjucks.FileSystemLoader("_includes")
    );
    eleventyConfig.setLibrary("njk", nunjucksEnvironment);
    
}