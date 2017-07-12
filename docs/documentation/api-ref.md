---
layout: doc
title: API Reference
index: 2
section: documentation
---

### Configuration

**`dateRange`** (`array<Date>`)\\
Range of the timeline, from date A to date B.
  - Example:
```js
dateRange: [
  new Date('01 Jan 2010'), // from 01-01-2010
  new Date('01 Jan 2020')  // to 01-01-2020
]
```

**`data`** (`array<{date: Date, label?: string}>`)\\
Array of data to represent each dots on the timeline.
  - Example:
```js
data: [
  // label is optional
  {date: new Date(), label: 'First task'},
  {date: new Date('20 Jul 1969'), label: 'Moon landing'},
  ...
]
```

**`selector`** (`string | HtmlElement`)\\
Mount the timeline to the given Html node
  - Example: `selector: '#timeline'`

**`intervals`** (`array<array>>`)\\
To create intervals separated by pivots in the timeline. An array is composed of `[Date A, Date B, width (in pixels)]`.
  - Example:
```js
intervals: [
  [new Date(2017, 1, 1), new Date(2017, 3, 1), 200],
  ...
]
```

**`timeFormat`** (`string`)\\
String to format the labels, check the [d3-time-format documentation](https://github.com/d3/d3-time-format#locale_format) for more information about the available formats.

**`ticksIntervals`** (`string`)\\
Intervals of period for each tick, can be `Day`, `Week`, `Month` or `Year`.

**`eventListeners`** (`{typenames: callback}`)\\
Add a callback for the specified typenames for events. For more information, please [check the D3 documentation](https://github.com/d3/d3-selection#selection_on).
  - Example:
```js
eventListeners: {
  click: function(event) {
        alert(event.labels[0]);
  }
}
```

**`pivotListeners`** (`{typenames: callback}`)\\
Add a callback for the specified typenames for pivots (like eventListeners).

**`margin`** (`{top: number, right: number, bottom: number, left: number}`)\\
To define margin around the timeline.

**`animation`** (`{}`)
  - `time: number`: Time of transitions
  - `ease: string`: Specifies the transition easing function for elements in the timeline, check [d3-ease documentation](https://github.com/d3/d3-ease#api-reference) for more information.

**`clustering`** (`{}`)
  - `maxSize: number`: Max size of cluster in pixels
  - `epsilon: number`: Gravity between events when cluster
  - `maxLabelNumber: number`: Maximum number possible on clusters labels

**`events`** (`{}`)
  - `size: number`: Size of events circles

**`dragAndDrop`** (`{}`)
  - `throttle: number`: Margin to drag and drop the pivot more easily
  - `zoneWidth: number`: Width of the drag zone
