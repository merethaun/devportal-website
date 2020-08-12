---
layout: pages/module.njk
pageTitle: Brandmaker Dev Portal
pagination:
    data: collections.productVersions
    size: 1
    alias: productVersion
    addAllPagesToCollections: true
permalink: "api/{{ productVersion[0] }}/{{ productVersion[1] }}/"
eleventyComputed:
    destination: "/api/{{ productVersion[0] }}/{{ productVersion[1] }}/{{ productVersion[2] }}"
    eleventyNavigation:
        parent: "{{ productVersion[0] }}"
        key: "{{ productVersion[0] }}/{{ productVersion[1] }}"
        title: "{{ productVersion[1] }}"
---