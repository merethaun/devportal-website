---
layout: pages/swagger.njk
pageTitle: Brandmaker Dev Portal
pagination:
    data: collections.apiVersions
    size: 1
    alias: apiVers
    addAllPagesToCollections: true
permalink: "api/{{ apiVers[0] }}/{{ apiVers[2] }}/{{ apiVers[3] }}/index.html"
eleventyComputed:
    eleventyNavigation:
        parent: "{{ apiVers[0] }}/{{ apiVers[2] }}"
        key: "{{ apiVers[3] }}"
    module: "{{ apiVers[0] }}"
    displayName: "{{ apiVers[1] }}"
    productVersion: "{{ apiVers[2] }}"
    apiVersion: "{{ apiVers[3] }}"
    swaggerFile: "{{ apiVers[4] }}"
---