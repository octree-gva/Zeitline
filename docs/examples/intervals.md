---
index: 1
layout: doc-example
title: Intervals
section: examples
---

Timeline with multiple intervals creating a polylinear time axis. Pivots (the red lines) can be drag and drop.

```js
var conf = {
  dateRange: [
    new Date('2017-01-01'),
    new Date('2018-01-01'),
  ],
  intervals: [
    [new Date('09 May 2017'), new Date('12 May 2017'), 250],
    [new Date('30 Jun 2017'), new Date('10 Dec 2017'), 100],
  ],
  data: [
    {date: new Date('31 Jan 2017')},
    {date: new Date('10 May 2017')},
    {date: new Date('11 May 2017')},
    {date: new Date('10 Jun 2017')},
    {date: new Date('30 Jun 2017')},
    {date: new Date('24 Dec 2017')},
  ]
};

var t = new Zeitline.Timeline(conf);
t.render();
```

<script>
var conf = {
  selector: '#timeline',
  dateRange: [
    new Date('2017-01-01'),
    new Date('2018-01-01'),
  ],
  intervals: [
    [new Date('09 May 2017'), new Date('12 May 2017'), 250],
    [new Date('30 Jun 2017'), new Date('10 Dec 2017'), 100],
  ],
  data: [
    {date: new Date('31 Jan 2017')},
    {date: new Date('10 May 2017')},
    {date: new Date('11 May 2017')},
    {date: new Date('10 Jun 2017')},
    {date: new Date('30 Jun 2017')},
    {date: new Date('24 Dec 2017')},
  ]
};

var t = new Zeitline.Timeline(conf);
t.render();
</script>
