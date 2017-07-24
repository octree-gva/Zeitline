---
layout: doc
title: Getting started
index: 1
section: documentation
---

To instantiate the timeline, simply import `Timeline` from `Zeitline`.
An optional configuration can be passed in the constructor `Timeline(configuration: object)`.

```js
import {Timeline} from 'Zeitline';

// instantiate the timeline with an optional configuration
let t = new Timeline({/* config */});
```

To render the timeline, use the `render()` function.

```js
// render the timeline
t.render();
```

To update the timeline with a new configuration, use the `update(configuration: object)` function
and pass the new configuration.

```js
// update the timeline with a new configuration
t.update({/* config */});
```
