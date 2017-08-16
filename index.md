---
layout: home
---

<div class="jumbotron mt-2">
  <h1 class="display-3">Zeitline</h1>
  <p class="lead">Zeitline is an open-source timeline build with React + D3.js for interactivity.</p>
  <hr class="my-4">
  <p class="lead">
    Please check the documentation to get started !
  </p>
  <p style="margin-top: 40px">
    <a class="btn btn-primary btn-lg"
       href="documentation" 
       role="button">
      Documentation
    </a>
      {% if site.github_username %}
      <a class="btn btn-secondary btn-lg" href="https://github.com/{{ site.github_username }}/Zeitline">
        Github  
      </a>
      {% endif %}
  </p>
</div>


<div class="card mb-3 timeline-example">
    <div class="card-block mx-auto">
        <svg id="timeline" class="mx-auto" width="800" height="100"></svg>
    </div>
</div>

<script src="https://unpkg.com/zeitline@0.x.x/dist/zeitline.bundle.min.js"></script>
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
    {date: new Date('12 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('15 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('18 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('19 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('29 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('30 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('31 Jan 2017'), label: 'Last day of this month'},
    {date: new Date('10 May 2017'), label: 'My birthday'},
    {date: new Date('11 May 2017'), label: 'Birthday party'},
    {date: new Date('12 May 2017'), label: 'Birthday party'},
    {date: new Date('13 May 2017'), label: 'Birthday party'},
    {date: new Date('20 May 2017'), label: 'Birthday party'},
    {date: new Date('25 May 2017'), label: 'Birthday party'},
    {date: new Date('26 May 2017'), label: 'Birthday party'},
    {date: new Date('27 May 2017'), label: 'Birthday party'},
    {date: new Date('30 May 2017'), label: 'Birthday party'},
    {date: new Date('10 Jun 2017'), label: 'Jazz concert'},
    {date: new Date('24 Dec 2017'), label: 'Christmas !'},
  ],
  eventListeners: {
    click: function(event) {
      alert(event.labels[0]);
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
