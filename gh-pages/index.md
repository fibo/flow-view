---
title: flow-view
flow: /empty.json
---
# flow-view

> is a visual editor for [Dataflow programming][dataflow_wikipedia], powered by [React]+[Redux]

[Description](#description) |
[Installation](#installation) |
[License](#license)

This document refers to *flow-view* v2, which is implemented
in React, yeah! Previous version is still available [here](https://github.com/fibo/flow-view/tree/v1.2.1).

[![Whatchers](http://g14n.info/svg/github/watchers/flow-view.svg)](https://github.com/fibo/flow-view/watchers) [![Stargazers](http://g14n.info/svg/github/stars/flow-view.svg)](https://github.com/fibo/flow-view/stargazers) [![Forks](http://g14n.info/svg/github/forks/flow-view.svg)](https://github.com/fibo/flow-view/network/members)

[![NPM version](https://badge.fury.io/js/flow-view.svg)](http://badge.fury.io/js/flow-view) [![Build Status](https://travis-ci.org/fibo/flow-view.svg?branch=master)](https://travis-ci.org/fibo/flow-view?branch=master) [![Dependency Status](https://david-dm.org/fibo/flow-view.svg)](https://david-dm.org/fibo/flow-view) [![Change log](https://img.shields.io/badge/change-log-blue.svg)](http://g14n.info/flow-view/changelog)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![NPM](https://nodei.co/npm-dl/flow-view.png)](https://nodei.co/npm-dl/flow-view/)

## Description

*flow-view* is a reusable visual editor you can use to provide a GUI to your dataflow project. I am using it for [dflow], but, I would like it'd be used by other node projects, like [graft](https://github.com/GraftJS/graft).

> Please, help me give Node a common visual interface. Use *flow-view*!

Any feedback is welcome!

## Installation

With [bower](http://bower.io/) do

```bash
$ bower install flow-view
```

or use a CDN adding this to your HTML page

```html
<script src="https://cdn.rawgit.com/fibo/flow-view/master/dist/flow-view.min.js"></script>
```

Note that *flow-view* is universal, you can install it with [npm](https://npmjs.org/) as usual

```bash
$ npm install flow-view
```

## License

[MIT](http://g14n.info/mit-license)

[dflow]: http://g14n.info/dflow "dflow"
[dataflow_wikipedia]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
[React]: https://facebook.github.io/react/
[Redux]: http://redux.js.org/
