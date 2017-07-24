---
layout: doc
title: Installation
permalink: /documentation
index: 0
section: documentation
---

If you use NPM or Yarn, you can simply install Zeitline with:

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

Otherwise, you can download the UMD release and use it with vanilla javascript (in the `dist` folder).

Example to use Zeitline in vanilla javascript:

```html
<script src="zeitline.bundle.min.js"></script>
<script>
var t = new Zeitline.Timeline();
t.render();
</script>
```

A CDN is also available with the [Unpkg](http://unpkg.com) service. For example, the version 0.1.0 is available here `https://unpkg.com/zeitline@0.1.0/dist/zeitline.bundle.min.js`.

You can also use the latest version automatically by replacing the number by "x". For example if you want the last patch of the version 0.1 you can use the 0.1.x version like `https://unpkg.com/zeitline@0.1.x/dist/zeitline.bundle.min.js`.
