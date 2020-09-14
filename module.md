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
    destination: "{{ module[2] }}/"
    eleventyNavigation:
        parent: API
        key: "{{ module[0] }}"
        title: "{{ module[1] }}"
    module: "{{ module[0] }}"
---