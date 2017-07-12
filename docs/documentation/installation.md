---
layout: doc
title: Installation
permalink: /documentation
index: 0
section: documentation
---

If you use NPM or Yarn, you can simply install Zeitline like that:

```
npm install zeitline
or
yarn add zeitline
```

You can then use Zeitline in ES6:

```js
import {Timeline} from 'Zeitline';

const conf = ...

let t = new Timeline(conf);
t.render();
```

Otherwise, you can download the UMD release to use it in with vanilla javascript (in the `dist` folder).

Example to use Zeitline in vanilla javascript:

```html
<script src="zeitline.bundle.min.js"></script>
<script>
var t = new Zeitline.Timeline();
t.render();
</script>
```

A CDN is also available with the [Unpkg](http://unpkg.co) service. For example, the version 0.0.4 is available here `https://unpkg.co/zeitline@0.0.4/dist/zeitline.bundle.min.js`.
