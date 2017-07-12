---
index: 4
layout: doc-example
title: Custom CSS style
section: examples
---

Each element of the timeline can be customized with CSS.

```css
/* Color event in blue */
.event {
  fill: #4249ae;
}

/* Hover event in green */
.event:hover {
  fill: #5d8;
}

/* Reference lines (pivots and today line) as a red stroke */
.reference-line {
  stroke: #ee7d79;
  shape-rendering: crispEdges;
  stroke-dasharray: 6.7;
  stroke-linecap: round;
}

/* Change pivots opacity on drag */
.pivot-group.draggable {
  opacity: 0.6;
}

/* Show an arrow cursor to show that pivots are draggable */
.pivot-group:hover {
  cursor: col-resize;
}

/* Color axis in grey, 4px width */
.axis--x .domain {
  stroke: #e4e4e4;
  stroke-width: 4;
  stroke-linecap: round;
}

/* Change the opacity of text (tick and clusters) */
.tick text, .event-group text {
  opacity: .6;
}

/* Center each tick and color them in light grey */
.tick line {
  transform: translateY(-10px);
  stroke: rgba(180, 180, 180, .5);
  stroke-linecap: round;
}
```

<script>
var conf = {
  selector: '#timeline',
  dateRange: [
    new Date('2017-01-01'),
    new Date('2019-01-01'),
  ],
  intervals: [
    [new Date('09 May 2017'), new Date('12 May 2018'), 180]
  ],
  data: [
      {date: new Date('01 May 2017')},
      {date: new Date('10 Aug 2018')},
      {date: new Date('11 Aug 2018')},
  ]
};

var t = new Zeitline.Timeline(conf);
t.render();
</script>
