---
title: Change Log
permalink: /changelog
---

{% assign package = site.data.package %}
{% assign tags = site.data.tags %}

# Change Log

All notable changes to [flow-view project](http://g14n.info/flow-view) will be documented in [this file](https://github.com/fibo/flow-view/blob/master/gh-pages/changelog.md).

<sub>This project adheres to [Semantic Versioning](http://semver.org/).
Changelog format adheres to [Keep a Changelog](http://keepachangelog.com/)</sub>

### Added

* Handle CSS class when FlowViewCanvas is extended.

## [v4.1.0] - 2020-01-15

### Fixed

* online example

### Added

* `loadGraph()`
* rollup ES build
* CSS minification

### Removed

* browserify
* docs/ folder

## [v4.0.0] - 2020-01-10

New implementation written from scratch! Basically it has all previous features but it looks better.

### Added

* Styling via (old but gold) plain CSS file, instead of previous CSS-in-JS.
* Ready to be imported as an ES module.
* Can translate and even zoom canvas.
* Connect links from both source and targets, yes current implementation is far better and clear then before.

## [v3.0.0] - 2018-05-03

### Added

- Vanilla JS implementation: build size reduced a lot! Almost no need for softare updates, this stuff will work for ever 🤘
- JSON Schema.
- Inspector at left side to edit nodes.

### Removed

- React

## [v2.19.0] - 2017-12-10

### Added

- Trigger *updateNodesGeometry* event, when nodes are moved.
- Complete flowjs coverage.
- Pass theme as argument to Canvas constructor, created a dark theme example.
- Example dom/element.js
- Updated deps

## [v2.18.0] - 2017-11-23

### Added

- Nested theme props, improved structure.
- Renamed Canvas component to *FlowViewCanvas* so it will be recognizable in React Chrome extension or similar contexts.
- Updated deps.

### Changed

- The container should be passed explicitly in the Canvas contructor it does not make sense to create it.

### Fixed

- Improved Selector: solved dragging and other minor issues.
- Do not require React as a dependency. Also move react-test-renderer to dev deps.

### Removed

- The utils/ignoreEvent.js was removed cause handling on every class method is better for maintenance.

## [v2.17.1] - 2017-11-10

### Added

- Page with nav in basic example.
- Updated Jekyll includes.
- Updated deps.

### Fixed

- Require React 16 as peer deps.
- Better default theme colors.

## [v2.17.0] - 2017-10-09

### Added

- Links drawn behind nodes.
- Nodes filled with `nodeBodyColor` instead of transparent.

### Fixed

- Clean up document and window event listeners on Frame unmount.
- On mousedown on an input pin should not start node dragging.
- On mouseup on an input `connectLinkToTarget` was not defined.
- Delete selected link with backspace.

## [v2.16.0] - 2017-10-08

### Added

- Using `ReactDOM.unmountComponentAtNode(container)` before mounting `Frame`, calling `Canvas.render()` multiple times will work as expected.
- Updated deps, in particular to React 16.

### Fixed

- Jest warning `Duplicate module name`.

## [v2.15.2] - 2017-09-05

### Added

- More snapshot tests.

### Fixed

- Avoid using width and height on server side rendering, use viewBox to make frames responsive.
- Node plus and minus buttons disappeared when all pins were deleted.

## [v2.15.1] - 2017-09-03

### Added

- Updated deps.
- More flow coverage.
- Composition over inheritance.

## [v2.15.0] - 2017-08-15

### Added

- Using React v16 :metal:.
- Dropped prop-types, using flow static type checker.
- Big refactoring:
  - back again to ES6 syntactic sugar.
  - using src folder
- Using [bindme](http://g14n.info/bindme) for better React performance.
- UglifyJS v3 update and source map with comment preample support.
- Jest snapshot tests (few tests and boilerplate).
- Multiple rectangular selection area.
- Updated website style.

### Fixed

- Added docs/ folder to .npmignore

## [v2.14.3] - 2017-06-08

### Added

- File package-lock.json (npm v5).

### Fixed

- [Issue41](https://github.com/fibo/flow-view/issues/41): adding pins started dragging.

### Removed

- Check deps on commit. Probably cheerio will be replaced by jest, and uglifyjs v3 has breaking changes I need to evaluate now.

## [v2.14.1] - 2017-05-05

### Added

- Links in changelog.
- Deps update.
- Using docs/ folder instead of gh-pages.
- Using *prop-types*.

### Fixed

- Few improvements in .gitignore and README.md's markdown.

## [v2.14.0] - 2017-03-05

### Removed

- bower support

The goal is to minimize transpiling:
- Using only `var`, no `const` or `let`.
-  `Object.assign`, `import`, `class`.
- ES2015 babel preset and add-module-exports babel plugin.

### Changed

- Babel transpiling from *.jsx to *js, revisited procedure.
- CDN support for unpkg.com, dist folder on npm now.
- React as peer deps.

## [v2.12.0] - 2017-01-29

### Added

- Separated pin controls into methods.
- Double click in link to delete it.
- Selector datalist populated by *nodeList* parameter.
- Genealogic tree example.
- Hotkeys.
- Dragging multiple nodes.
- Events endDragging, selectNode, selectLink.

### Fixed

- Missing bottom and right border.

## [v2.11.0] - 2017-01-26

### Changed

- Inspector removed, interface looks better now.
- New color palette, interface looks worse now ;)
- Update deps.

## [v2.10.1] - 2017-01-14

### Fixed

- Build was broken, cause travis could not find React dep.
- Using caret versions.

## [v2.10.0] - 2017-01-02

### Added

- Dragged link is straight.
- Custom item example.
- Inspector position aside selected item.

## [v2.9.1] - 2016-12-25

### Fixed

- Improved theme implementation.
- Scroll issue.
- Handle resize event.

## [v2.9.0] - 2016-12-04

### Added

- Links are bezier curves instead of lines.

### Fixed

- Trim spaces in Selector only on enter.

## [v2.8.1] - 2016-10-23

### Fixed

- Start dragging a link source now creates a brand new link, to avoid conflicts.

## [v2.8.0] - 2016-10-08

### Added

- Rename node event.
- Node is selected automatically when created by selector.
- Online example.
- Updated deps.
- Using `NODE_ENV=production` for builds.

### Fixed

- Data sent by createLink and deleteLink events.

## [v2.7.1] - 2016-10-05

### Added

- Set default height and width, try to get them from container.
- Custom Inspector, used in dflow.

### Changed

- Renamed component Canvas to Frame to avoid confusion with Canvas class.
- canvas.render() accepts an optional *model* argument, needed for custom items.

### Fixed

- When dragging started from an input it was not possible to end it.

## [v2.6.1] - 2016-09-30

### Fixed

- Relaxed dependencies.
- Minor bug when adding an input to a node in a previous empty canvas.
- Selector reset its text on hide.

## [v2.6.0] - 2016-09-25

### Added

- Add or remove input and output pins.
- Emit events to let integrate with other libraries.
- Node dynamic width considered the number of pins.
- Better docs.

### Fixed

- Can pass width and height view props to Canvas.

## [v2.5.0] - 2016-09-24

### Added

- Custom components.
- Server side rendering.

### Changed

- No Redux, using React local state is fine.

## [v2.4.0] - 2016-08-23

### Changed

- Removed mapDispatchToProps, it will be easier to manage it or to port it to pure React.
- Started moving some state from Redux to React components.

### Fixed

- Fixed changelog links.

## [v2.3.0] - 2016-06-25

### Added

- Exposed actions, util/initialState, components and other stuff needed to import,
extend and use flow-view in other projects, in particular [dflow].

## [v2.1.1] - 2016-06-22

### Added

- Restored src/ folder, babel build is inverted now: compiled code is in root

## [v2.1.0] - 2016-06-18

### Fixed

- Put lib dir under version control, the npm package could not be imported.

### Added

- container element and containerId
- server side test

## [v2.0.0] - 2016-06-16

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

## [v1.2.1] - 2016-03-14

### Added

- CHANGELOG to gh-pages
- smaller build, less svg.js code
- removed dev deps and unnecessary server side tests

## [v1.1.0] - 2016-03-02

### Added

- [Codepen collection](http://codepen.io/collection/DojWVW/) of examples
- source map

## [v1.0.2] - 2016-02-20

### Added

- CHANGELOG.md
- GitHub social badges
- CDN installation instructions

## **1.0.0** - 2016-01-17

### First stable release

[dflow]: http://g14n.info/dflow "dflow"

[Unreleased]: https://github.com/fibo/{{ package.name }}/compare/v{{ package.version }}...HEAD

{% for tag in tags offset:2 %}
  {% assign current = tags[forloop.index0].name %}
  {% assign previous = tags[forloop.index].name %}
  [{{ current }}]: https://github.com/fibo/{{ package.name }}/compare/{{ previous }}...{{ current }}
{% endfor %}
