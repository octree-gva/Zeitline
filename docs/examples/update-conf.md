---
index: 3
layout: doc-example
title: Update the configuration
section: examples
---

Zeitline allows you to update the configuration on the fly and to re render the timeline with the new options. You can check an [other example here](update-conf2).

```js
var conf = {
  dateRange: [
    new Date('2017-01-01'),
    new Date('2018-01-01'),
  ],
  intervals: [
    [new Date('09 May 2017'), new Date('12 May 2017'), 250]
  ],
  data: [
    {date: new Date('31 Jan 2017'), label: 'First event'},
  ]
};

var t = new Zeitline.Timeline(conf);
t.render();

yourButtonElement.addEventListener('click', function() {
  conf.data = [
      {date: new Date('01 May 2017'), label: 'First event'},
      {date: new Date('01 Aug 2018'), label: 'Second event'},
      {date: new Date('15 Dec 2018'), label: 'Third event'},
  ];

  conf.dateRange = [
    new Date('2017-01-01'),
    new Date('2020-01-01'),
  ];
  
  // Re render the timeline with updated configuration
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
    {date: new Date('31 Jan 2017'), label: 'First event'},
  ]
};

var t = new Zeitline.Timeline(conf);
t.render();

var button = document.createElement('input');
button.type = 'button';
button.className = 'btn btn-primary';
button.value = 'Update configuration (add data, change dateRange)';

document.querySelector('.timeline-example').appendChild(button);

button.addEventListener('click', function() {
  conf.data = [
      {date: new Date('01 May 2017'), label: 'First event'},
      {date: new Date('01 Aug 2018'), label: 'Second event'},
      {date: new Date('15 Dec 2018'), label: 'Third event'},
  ];

  conf.dateRange = [
    new Date('2017-01-01'),
    new Date('2020-01-01'),
  ];
  
  t.update(conf);
}, false);
</script>
