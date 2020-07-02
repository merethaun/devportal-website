const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("api");
  eleventyConfig.addPassthroughCopy("main.css");

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
};
