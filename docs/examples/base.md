---
index: 0
layout: doc-example
title: Basic
section: examples
---

Basic timeline from the first day of 2017 to the first day of 2018 with some data events.

```js
var conf = {
  dateRange: [
    new Date('01 Jan 2017'),
    new Date('01 Jan 2018'),
  ],
  data: [
    {date: new Date('31 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('10 May 2017'), label: 'My birthday'},
    {date: new Date('11 May 2017'), label: 'Birthday party'},
    {date: new Date('10 Jun 2017'), label: 'Jazz concert'},
    {date: new Date('30 Jun 2017'), label: 'Vacations'},
    {date: new Date('24 Dec 2017'), label: 'Christmas !'},
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
  data: [
    {date: new Date('31 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('10 May 2017'), label: 'My birthday'},
    {date: new Date('11 May 2017'), label: 'Birthday party'},
    {date: new Date('10 Jun 2017'), label: 'Jazz concert'},
    {date: new Date('30 Jun 2017'), label: 'Vacations'},
    {date: new Date('24 Dec 2017'), label: 'Christmas !'},
  ]
};

var t = new Zeitline.Timeline(conf);
t.render();
</script>
