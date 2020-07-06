# Quickstart

clone repository and run `npm install`

## Static Site Generator

run `npm run dev`

## Adapting Styles (folder "style", Stylus Format)

run `npm run styles`

That gives you the contanating of Stylus to our one "main.css" we use for the pages.

## Organization:

Folders represent the structure on the website. \*.md files are the pages. Content/Data is configured via Front Matter. That means for example our api/mediapool document relies in /api/mediapool/index.md. In that file we determine the name of the swagger.json (versioning to be done).

## Swagger UI

Our adaption of Swagger UI lies in the folder /\_includes/pages/swagger. That means all we have to do is to copy the dist-folder from our swagger-ui project to this folder after each build.

## swagger.json

The swagger.json files should be transferred to each api/_module name_ folder. Naming convention to be done.
