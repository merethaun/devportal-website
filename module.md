---
layout: pages/module.njk
pageTitle: Brandmaker Dev Portal
pagination:
    data: collections.modules
    size: 1
    alias: module
    addAllPagesToCollections: true
permalink: "api/{{ module[0] }}/"
eleventyComputed:
    destination: "{{ module[1] }}/"
    eleventyNavigation:
        parent: API
        key: "{{ module[0] }}"
    module: "{{ module[0] }}"
---