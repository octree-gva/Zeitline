# Zeitline

Zeitline is a flexible timeline implemented in D3.

[![license](https://img.shields.io/github/license/octree-gva/d3-timeline.svg?style=flat-square)]()

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

## API Reference

* [Getting started](#getting-started)
* [Configuration](#configuration)

### Getting started

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

### Configuration

- **`dateRange`** (`array<Date>`): Range of the timeline, from date A to date B.
- **`data`** (`array<{date: Date, label: string}>`): Array of data to represent each dots on the timeline.
  - Example: `data: [{date: new Date(), label: 'First task'}, ...]`
- **`selector`** (`string | HtmlElement`): Mount the timeline to the given Html node
- **`intervals`** (`array<array>>`): To create intervals in the timeline. Add an array of Date A, Date B and then size in pixels.
  - Example: `intervals: [[new Date(2017, 1, 1'), new Date(2017, 3, 1), 200], ...]`
- **`timeFormat`** (`string`): String to format the labels, check the [d3-time-format documentation](https://github.com/d3/d3-time-format#locale_format) for more information about the available formats.
- **`ticksIntervals`** (`string`): Intervals of period for each tick, can be `Day`, `Week`, `Month` or `Year`.
- **`onClick`** (`function`): Callback when a dot is clicked
- **`options`** (`object`)
  - `margin` (`{top: number, right: number, bottom: number, left: number}`)
  - `animation` (`{time: number, ease: string}`): The ease propriety specifies the transition easing function for elements in the timeline, check [d3-ease documentation](https://github.com/d3/d3-ease#api-reference) for more information.
  - `clustering`
    - `maxSize: number`: Max size of cluster in pixels
    - `epsilon: number`: Gravity between events when cluster
  - `events`
    - `size: number`: Size of events circles



## Dev

Install the dependencies

```
npm install
or
yarn install
```

### Running the dev server

```
yarn dev
```

The project is then served on http://localhost:8080/

### Build the project

```
yarn build
```

The project will be build in `./dist/d3-timeline.bundle.js`


## Tests

To run the tests, use npm or yarn

```
npm run test
or
yarn test
```
