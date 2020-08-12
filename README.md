# Devportal-website

Our static web pages that build the environment for the adapted [Swagger UI](https://github.com/brandmaker/swagger-ui). \
This static site generator uses eleventy. 

## Quickstart
Clone the repository and run `npm install`

### Static Site Generator
Run `npm run dev`. \
This creates the dist folder (_site) and starts up a hot-reloading local web server. \
If you only want to build "_site" run `npm run build`.

### Adapting Styles
Run `npm run styles`. \
That gives you the contanating of Stylus to our one "main.css" we use for the pages (folder "style", Stylus Format)

## Organization
*.md files create the pages. 
- index: the main page
- api
- github

Additionally the Swagger files are generated via [pagination](https://www.11ty.dev/docs/pagination/).

### Swagger UI
Our adaption of Swagger UI lies in the folder "swagger". That means all we have to do is to copy the dist-folder from our swagger-ui project to this folder after each build.

### swagger.json files
The swagger.json files should be added into the "api" folder in the following structure: 
- api/module name/
    - product version/
        - api version/
            - \<modulename>-api-\<version>.json

The last folder should only contain one file. \
Example: _api/MediaPool/6.8/6.8.1.0/mediapool-api-6.8.1.0.json_

This will generate one page per module, one per product version and one per api version using pagination. (with module.md, product.md, swagger.md) \
Thereby the module and product version pages will link to the newest api version page.

## Used npm Packages
- eleventy navigation: 
    - https://www.11ty.dev/docs/plugins/navigation/
    - to use combined with pagination: add `addAllPagesToCollections: true` to pagination description
- fast glob (to fetch api folder structure)
    - https://github.com/mrmlnc/fast-glob
- gulp:
    - https://gulpjs.com/docs/en/getting-started/quick-start
    - including:
        - autoprefixer
        - gulp-plumber
        - gulp-postcss
        - gulp-sourcemaps
        - gulp-stylus
        - gulp-watch

