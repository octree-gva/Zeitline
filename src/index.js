import * as d3 from 'd3';
import moment from 'moment';

let conf = {
  dateRange: [
    moment(),
    moment().add(1, 'Year'),
  ],
  timeFormat: '%B',
  intervals: 'Month', // Day, Week, Month, Year
  data: [
    {date: moment().add(5, 'hours'), label: 'test1'},
    {date: moment().add(2, 'days'), label: 'test2'},
    {date: new Date('May 2017'), label: 'test3'},
    {date: new Date('15 May 2017'), label: 'test4'},
    {date: new Date('Aug 2017'), label: 'test5'},
    {date: new Date('Sep 2017'), label: 'test6'},
    {date: new Date('Jan 2018'), label: 'test7'},
  ],
  callback: function() {
    alert(this.label);
  },
};

let svg = d3.select('svg');
let margin = {top: 20, right: 20, bottom: 20, left: 30};
let width = +svg.attr('width') - margin.left - margin.right;
let height = +svg.attr('height') - margin.top - margin.bottom;

let x = d3.scaleTime().range([0, width]);
x.domain(d3.extent(conf.dateRange));

// timeDay, timeWeek, timeMonth, timeYear
let xAxis = d3.axisBottom(x)
  .ticks(d3[`time${conf.intervals}`]);
  // .tickFormat(d3.time.format('%Y'))

// let zoom = d3.zoom()
//     .scaleExtent([1, Infinity])
//     .translateExtent([[0, 0], [width, height]])
//     .extent([[0, 0], [width, height]])
//     .on('zoom', zoomed);

svg.append('defs').append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

let focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

focus.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

// focus.selectAll('dot')
//   .attr('class', 'dot')
//   .data(conf.data)
//   .enter()
//   .append('circle')
//   .attr('r', 5)
//   .attr('cx', (d) => x(d.date))
//   .attr('cy', 120);
  // .attr('transform', (d) => {
  //   // console.log(d)
  //   return 'translate(' + x(d.date) + ', 0)'
  // })
  // .append('text')
  // .text((d) => d.label);

let circles = focus.selectAll('circle');
//   .data(conf.data)
//   .enter()
//   .append('circle')
//   .attr('class', 'dot')
//   .attr('r', 5)
//   .attr('cx', (d) => x(d.date))
//   .attr('cy', 50);

// focus
//   .selectAll('text')
//   .data(conf.data)
//   .append('text')
//   .attr('transform', (d) => {
//     // console.log(d)
//     return 'translate(' + x(d.date) + ', 0)';
//   })
//   .text((d) => d.label);


let t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

function updateData(newConf) {
  // console.log(newConf);

  // Range
  if (newConf.dateRange) {
    x.domain(d3.extent(newConf.dateRange));
  }

  // Intervals
  if (newConf.intervals) {
    xAxis.ticks(d3[`time${newConf.intervals}`]);
  }

  circles
    .remove();

  circles
    .data(newConf.data)
    .enter()
    .append('circle')
    .attr('class', 'dot2')
    .attr('r', 5)
    .attr('cx', (d) => x(d.date))
    .attr('cy', 50)
    .on('click', (circle) => {
      if (newConf.callback) {
        newConf.callback.apply(circle);
      }
      d3.event.stopPropagation();
    });

  if (newConf.timeFormat && newConf.timeFormat !== '') {
    console.log('aaa');
    xAxis.tickFormat((d) => d3.timeFormat(newConf.timeFormat)(d));
  } else {
    // Reset default format
    xAxis.tickFormat(null);
  }

  // if (newConf.intervals || newConf.dateRange) {
  svg.select('.axis--x')
    .transition(t)
    .call(xAxis);
  // }

// circles
//   .data(newConf.data)
//   .attr('class', 'dot2')
//   .enter()
//   .append('circle')
//   .attr('r', 5)
//   .attr('cx', (d) => x(d.date))
//   .attr('cy', 50);

// circles
//   .attr('class', 'dot2')
//   .data(newConf.data)
//   // .enter()
//   // .append('circle')
//   // .attr('r', 5)
//   // .attr('cx', (d) => x(d.date))
//   // // .attr('x', (d) => x(d.date))
//   // .attr('cy', 50);

//   circles
//     .enter()
//     .append('circle')

//   circles
//     .transition(t)
//     .attr('r', 5)
//     .attr('cy', 20)
//     .attr('cx', (d) => d.date);

//   circles
//     .exit()
//     .remove();


  // // Edit dots
  // circles
  //   // .enter()

  // .append('circle')
  // .attr('r', 5)
  // .attr('cy', 50)

  //   // .data(conf.data)
  //   .transition(t)
  //   // .duration(750)
  //   // .attr('d', (newConf.data))
  //   .attr('cx', (d) => x(d.date))
  //   ;

  // let zoom = d3.zoom().on('zoom', zoomed);

  // let transform = d3.event.transform;

  // // rescale the x linear scale so that we can draw the top axis
  // let xNewScale = transform.rescaleX(x);
  // xAxis.scale(xNewScale);
  // // gTopAxis.call(xTopAxis);

  // // draw the circles in their new positions
  // circles.attr('cx', function(d) { return transform.applyX(x(d)); });
}

updateData(conf);

document.querySelectorAll('.interval').forEach((e) => {
  e.addEventListener('click', (e) => {
    let typeInt = e.target.getAttribute('data-interval');
    let ticksInterval = e.target.getAttribute('data-ticks-interval');
    let timeFormat = e.target.getAttribute('data-time-format');
    conf.timeFormat = timeFormat;
    conf.intervals = ticksInterval;

    conf.dateRange = [
      moment(),
      moment().add(1, typeInt),
    ];
    updateData(conf);
  }, false);
});

document.querySelector('.move-left').addEventListener('click', (e) => {
  conf.dateRange[0].add(1, conf.intervals)
  conf.dateRange[1].add(1, conf.intervals)
  updateData(conf);
}, false);

document.querySelector('.move-right').addEventListener('click', (e) => {
  conf.dateRange[0].subtract(1, conf.intervals)
  conf.dateRange[1].subtract(1, conf.intervals)
  updateData(conf);
}, false);
