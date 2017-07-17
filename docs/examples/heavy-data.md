---
index: 4
layout: doc-example
title: Load a lot of data
section: examples
---

Zeitline is able to handle a lot of data without having performance issues.

```js
var conf = {
  selector: '#timeline',
  dateRange: [
    new Date('2017-01-01'),
    new Date('2018-01-01'),
  ],
  intervals: [
    [new Date('01 May 2017'), new Date('30 May 2017'), 220],
    [new Date('30 Jun 2017'), new Date('10 Dec 2017'), 100],
  ]
};

// Read events from CSV file
// You need to import d3 to be able to use "d3.csv"
d3.csv('https://raw.githubusercontent.com/wiki/arunsrinivasan/flights/NYCflights14/weather_delays14.csv', function(data) {
  conf.data = data.map(function(d) { 
    return {date: new Date(2017, +d.month, +d.day), label: d.flight};
  });

  var t = new Zeitline.Timeline(conf);
  t.render();
});
```

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.10.0/d3.min.js"></script>
<script>
var conf = {
  selector: '#timeline',
  dateRange: [
    new Date('2017-01-01'),
    new Date('2018-01-01'),
  ],
  intervals: [
    [new Date('01 May 2017'), new Date('30 May 2017'), 220],
    [new Date('30 Jun 2017'), new Date('10 Dec 2017'), 100],
  ]
};

d3.csv('https://raw.githubusercontent.com/wiki/arunsrinivasan/flights/NYCflights14/weather_delays14.csv', function(data) {
  conf.data = data.map(function(d) { 
    return {date: new Date(2017, +d.month, +d.day), label: d.flight};
  });

  var t = new Zeitline.Timeline(conf);
  t.render();
});
</script>
