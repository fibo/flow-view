---
title: Change Log
permalink: /changelog
---

{% assign package = site.data.package %}
{% assign tags = site.data.tags %}

# Change Log

All notable changes to this project will be documented in this file.

<sub>This project adheres to [Semantic Versioning](http://semver.org/).
Changelog format adheres to [Keep a Changelog](http://keepachangelog.com/)</sub>

## [Unreleased]

### TODO

server side rendering, canvas.exportToSVG exportToFileSVG

## [2.1.0] - 2016-06-18

### Fixed

- Put lib dir under version control, the npm package could not be imported.

### Added

- container element and containerId
- server side test

## [2.0.0] - 2016-06-16

### Added

- budo dev server and react hot loading
- dynamic changelog
- Codepen example for v2
- Better header comment for minified version
- lib dir, contains commonjs build
- svgx
- more tests with cheerio, and also server side... finally I can use travis
- React components
- standard js
- ES6 code and babel transpiling
- pre-commit hooks

## [1.2.1] - 2016-03-14

### Added

- CHANGELOG to gh-pages
- smaller build, less svg.js code
- removed dev deps and unnecessary server side tests

## [1.1.0] - 2016-03-02

### Added

- [Codepen collection](http://codepen.io/collection/DojWVW/) of examples
- source map

## [1.0.2] - 2016-02-20

### Added

- CHANGELOG.md
- GitHub social badges
- CDN installation instructions

## **1.0.0** - 2016-01-17

### First stable release

[Unreleased]: https://github.com/fibo/{{ package.name }}/compare/v{{ package.version }}...HEAD

{% for tag in tags offset:2 %}
  {% assign current = tags[forloop.index0].name %}
  {% assign previous = tags[forloop.index].name %}
  [{{ current }}]: https://github.com/fibo/{{ package.name }}/compare/{{ previous }}...{{ current }}
{% endfor %}
