---
layout: pages/swagger.njk
pageTitle: Brandmaker Dev Portal
pagination:
    data: collections.apiVersions
    size: 1
    alias: apiVers
    addAllPagesToCollections: true
permalink: "api/{{ apiVers[0] }}/{{ apiVers[1] }}/{{ apiVers[2] }}/index.html"
eleventyComputed:
    eleventyNavigation:
        parent: "{{ apiVers[0] }}/{{ apiVers[1] }}"
        key: "{{ apiVers[2] }}"
    module: "{{ apiVers[0] }}"
    productVersion: "{{ apiVers[1] }}"
    apiVersion: "{{ apiVers[2] }}"
    swaggerFile: "{{ apiVers[3] }}"
---