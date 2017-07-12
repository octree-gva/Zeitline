---
layout: doc
title: Getting started
index: 1
section: documentation
---

To instantiate the timeline, simple import `Timeline` from `Zeitline`.
An optional configuration can be passed in the constructor `Timeline(configuration: object)`.

```js
import {Timeline} from 'Zeitline';

let t = new Timeline({/* config */}); // instantiate the timeline with an optional configuration
```

To render the timeline, use the `render()` function.

```js
t.render(); // render the timeline
```

To update the timeline with a new configuration, use the `update(configuration: object)` function
and pass the new configuration.

```js
t.update({/* config */}); // update the timeline with a new configuration
```
