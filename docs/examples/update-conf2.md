---
index: -1
layout: doc-example
title: Update the configuration (2)
section: examples
---

```js
var conf = {
  dateRange: [
    new Date('2017-01-01'),
    new Date('2018-01-01'),
  ],
  data: [
    // ...
  ]
};

var t = new Zeitline.Timeline(conf);
t.render();

buttonNext.addEventListener('click', (e) => {
  var diff = conf.dateRange[1] - conf.dateRange[0];
  conf.dateRange[0] -= -diff;
  conf.dateRange[1] -= -diff;
  t.update(conf);
}, false);

buttonPrev.addEventListener('click', (e) => {
  var diff = conf.dateRange[1] - conf.dateRange[0];
  conf.dateRange[0] -= diff;
  conf.dateRange[1] -= diff;
  t.update(conf);
}, false);
```

<script>
var conf = {
  selector: '#timeline',
  dateRange: [
    new Date('2017-01-01'),
    new Date('2018-01-01'),
  ],
  data: [
    {date: new Date('31 Jan 2014')},
    {date: new Date('10 Feb 2014')},
    {date: new Date('24 Dec 2014')},
    {date: new Date('02 Apr 2015')},
    {date: new Date('20 Apr 2015')},
    {date: new Date('24 Dec 2015')},
    {date: new Date('05 Jan 2016')},
    {date: new Date('10 Jan 2016')},
    {date: new Date('10 Aug 2016')},
    {date: new Date('24 Dec 2016')},
    {date: new Date('01 Jan 2017')},
    {date: new Date('01 Feb 2017')},
    {date: new Date('01 Apr 2017')},
    {date: new Date('01 Sep 2017')},
    {date: new Date('10 Dec 2017')},
    {date: new Date('24 Dec 2018')},
    {date: new Date('12 Apr 2018')},
    {date: new Date('25 Sep 2018')},
    {date: new Date('15 Dec 2019')},
    {date: new Date('31 Dec 2019')},
    {date: new Date('20 May 2020')},
    {date: new Date('20 Sep 2021')},
  ]
};

var t = new Zeitline.Timeline(conf);
t.render();

var group = document.createElement('div');
group.className = 'btn-group';

var buttonPrev = document.createElement('input');
buttonPrev.type = 'button';
buttonPrev.className = 'btn btn-secondary';
buttonPrev.value = '<- Past';
group.appendChild(buttonPrev);

var buttonNext = document.createElement('input');
buttonNext.type = 'button';
buttonNext.className = 'btn btn-secondary';
buttonNext.value = 'Future ->';
group.appendChild(buttonNext);

document.querySelector('.timeline-example')
  .appendChild(group);

buttonNext.addEventListener('click', (e) => {
  var diff = conf.dateRange[1] - conf.dateRange[0];
  conf.dateRange[0] -= -diff;
  conf.dateRange[1] -= -diff;
  t.update(conf);
}, false);

buttonPrev.addEventListener('click', (e) => {
  var diff = conf.dateRange[1] - conf.dateRange[0];
  conf.dateRange[0] -= diff;
  conf.dateRange[1] -= diff;
  t.update(conf);
}, false);
</script>
