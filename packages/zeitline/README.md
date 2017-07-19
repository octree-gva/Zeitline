# Zeitline

Zeitline is a flexible timeline implemented in D3.

[![license](https://img.shields.io/github/license/octree-gva/zeitline.svg?style=flat-square)]()
[![GitHub release](https://img.shields.io/github/tag/octree-gva/zeitline.svg?style=flat-square)]()


Please don't forget to check **[the Zeitline documentation](https://octree-gva.github.io/Zeitline/)** for more information.

## Installing

If you use NPM or Yarn, you can simply install Zeitline like that:

```
npm install zeitline
or
yarn add zeitline
```

Otherwise, you can download the UMD release (in the `dist` folder).

Example to use Zeitline in vanilla javascript:

```html
<script src="zeitline.bundle.min.js"></script>
<script>
var t = new Zeitline.Timeline();
t.render();
</script>
```

Example to use Zeitline in ES6:

```js
import {Timeline} from 'Zeitline';

let t = new Timeline(conf);
t.render();
```

## Getting started

To instantiate the timeline, simple import `Timeline` from `Zeitline`.
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

For more information about the configuration, please **[check the documentation](https://octree-gva.github.io/Zeitline/docs/documentation/api-ref.html)**.


## Dev

Firstly you need to install all the dependencies

```
npm install
or
yarn install
```

### Running the dev server

Simply run the `dev` script with

```
npm run dev
or
yarn dev
```

The project is then served on http://localhost:8080/

### Build the project

To build Zeitline, run the `build` script

```
npm run build
or
yarn build
```

It will will build two files; `./dist/zeitline.bundle.js` and the minified version `./dist/zeitline.bundle.min.js`.


## Tests

Test can be run with the `test` script.

```
npm run test
or
yarn test
```
