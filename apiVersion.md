---
layout: pages/swagger.njk
pageTitle: Brandmaker Dev Portal
pagination:
    data: collections.apiVersions
    size: 1
    alias: apiVersion
    addAllPagesToCollections: true
permalink: "api/{{ apiVersion[0] }}/{{ apiVersion[1] }}/{{ apiVersion[2] }}/index.html"
eleventyComputed:
    eleventyNavigation:
        parent: "{{ apiVersion[0] }}/{{ apiVersion[1] }}"
        key: "{{ apiVersion[2] }}"
    module: "{{ apiVersion[0] }}"
    swaggerFile: "{{ apiVersion[3] }}"
---