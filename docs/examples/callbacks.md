---
index: 2
layout: doc-example
title: Callbacks
section: examples
---

Zeitline allows you to register callback to events or pivots. Try to click on an event or to drag a pivot in the interactive example !

```js
var timelineEl = document.querySelector('.timeline-example');

var conf = {
  dateRange: [
    new Date('2017-01-01'),
    new Date('2018-01-01'),
  ],
  intervals: [
    [new Date('09 May 2017'), new Date('12 May 2017'), 250]
  ],
  data: [
    {date: new Date('31 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('10 May 2017'), label: 'My birthday'},
    {date: new Date('11 May 2017'), label: 'Birthday party'},
    {date: new Date('10 Jun 2017'), label: 'Jazz concert'},
    {date: new Date('24 Dec 2017'), label: 'Christmas !'},
  ],
  eventListeners: {
    click: function(event) {
      console.log(event);
      timelineEl.style.background = '#3498db';
      setTimeout(() => {
        timelineEl.style.background = '#fff';
      }, 1000);
    },
  },
  pivotListeners: {
    start: function(event) {
      timelineEl.style.background = '#f1c40f';
    },
    end: function(event) {
      timelineEl.style.background = '#fff';
    },
  },
};

var t = new Zeitline.Timeline(conf);
t.render();
```

<script>
var timelineEl = document.querySelector('.timeline-example');

var conf = {
  selector: '#timeline',
  dateRange: [
    new Date('2017-01-01'),
    new Date('2018-01-01'),
  ],
  intervals: [
    [new Date('09 May 2017'), new Date('12 May 2017'), 250]
  ],
  data: [
    {date: new Date('31 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('10 May 2017'), label: 'My birthday'},
    {date: new Date('11 May 2017'), label: 'Birthday party'},
    {date: new Date('10 Jun 2017'), label: 'Jazz concert'},
    {date: new Date('24 Dec 2017'), label: 'Christmas !'},
  ],
  eventListeners: {
    click: function(event) {
      console.log(event);
      timelineEl.style.background = '#3498db';
      setTimeout(() => {
        timelineEl.style.background = '#fff';
      }, 1000);
    },
  },
  pivotListeners: {
    start: function(event) {
      timelineEl.style.background = '#f1c40f';
    },
    end: function(event) {
      timelineEl.style.background = '#fff';
    },
  },
};

var t = new Zeitline.Timeline(conf);
t.render();
</script>
