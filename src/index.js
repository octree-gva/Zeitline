import * as d3 from 'd3';
import moment from 'moment';

let conf = {
  dateRange: [
    moment(),
    moment().add(1, 'year'),
    moment().add(3, 'years'),
    // moment().add(3, 'years'),
  ],
  zoomSplit: 280, // TODO: Multiple zoom split ?
  timeFormat: '%B',
  intervals: 'Month', // Day, Week, Month, Year
  data: [
    {date: moment().add(10, 'hours'), label: 'test1'},
    {date: moment().add(2, 'days'), label: 'test2'},
    {date: new Date('29 Apr 2017'), label: 'test3a'},
    {date: new Date('29 Apr 2017'), label: 'test3b'},
    {date: new Date('1 May 2017'), label: 'test3c'},
    {date: new Date('10 May 2017'), label: 'test3d'},
    {date: new Date('25 May 2017'), label: 'test4'},
    {date: new Date('25 May 2017'), label: 'test4B'},
    {date: new Date('30 May 2017'), label: 'test4C'},
    {date: new Date('10 Jun 2017'), label: 'test_Jun1'},
    {date: new Date('15 Jun 2017'), label: 'test_Jun2'},
    {date: new Date('10 Aug 2017'), label: 'test5'},
    {date: new Date('Sep 2017'), label: 'test6'},
    {date: new Date('10 Oct 2017'), label: 'test6'},
    {date: new Date('24 Dec 2017'), label: 'test7'},
    {date: new Date('31 Dec 2017'), label: 'test8'},
    {date: new Date('Jan 2018'), label: 'test9'},
    {date: new Date('Feb 2018'), label: 'test9'},
    {date: new Date('10 May 2018'), label: 'test10'},
    {date: new Date('10 May 2018'), label: 'test11'},
    {date: new Date('25 May 2018'), label: 'test13'},
    {date: new Date('Aug 2018'), label: 'test12'},
    {date: new Date('Jan 2019'), label: 'test13'},
    {date: new Date('Jan 2021'), label: 'test14'},
    {date: new Date('Jan 2022'), label: 'test15'},
    {date: new Date('Jan 2030'), label: 'test16'},
  ],
  onClick: function() {
    console.log(this);
    document.querySelector('body').style.background = ['#9b59b6', '#1abc9c', '#f39c12'][Math.floor(Math.random() * 3)];
    setTimeout(() => {
      document.querySelector('body').style.background = '#fff';
    }, 1100);
  },
};

let svg = d3.select('svg');
let margin = {top: 20, right: 20, bottom: 25, left: 30};
let width = +svg.attr('width') - margin.left - margin.right;
let height = +svg.attr('height') - margin.top - margin.bottom;

let x = d3.scaleTime()
  .domain(conf.dateRange)
  .range([0, width - conf.zoomSplit, width]);

// timeDay, timeWeek, timeMonth, timeYear
let xAxis = d3.axisBottom(x)
  .ticks(d3[`time${conf.intervals}`])
  .tickPadding(-5)
  .tickSize(18);
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

// Zoom separation
focus
  .append('line')
  .attr('class', 'linear reference-line')
    .attr('x1', width - conf.zoomSplit)
    .attr('x2', width - conf.zoomSplit)
    .attr('y1', margin.top)
    .attr('y2', height);


// focus
//   .selectAll('text')
//   .data(conf.data)
//   .append('text')
//   .attr('transform', (d) => {
//     // console.log(d)
//     return 'translate(' + x(d.date) + ', 0)';
//   })
//   .text((d) => d.label);

// let t = d3.transition()
//     .duration(500)
//     .ease(d3.easeLinear);

function updateData(newConf) {
  // Range
  if (newConf.dateRange) {
    // x.domain(d3.extent(newConf.dateRange));
    x.domain(newConf.dateRange);
  }

  // Intervals
  if (newConf.intervals) {
    xAxis.ticks(d3[`time${newConf.intervals}`]);
  }

  focus.selectAll('circle')
    // .exit()
    .remove();

  focus.selectAll('circle')
    .data(newConf.data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => x(d.date))
    .attr('transform', function(d, i) {
      if (i > 0) {
        let currenty = x(d.date);
        let previousy = x(newConf.data[i-1].date);
        if (currenty - previousy < 15) {
          if (newConf.data[i-1].pos) {
            d.pos = newConf.data[i-1].pos + 1;
          } else {
            d.pos = 1;
          }
          return 'translate(' + 0 + ',' + -15 * d.pos + ')';
        }
      }
    })
    .attr('cy', 120)
    // .on('click', (circle) => {
    //   if (newConf.onClick) {
    //     newConf.onClick.apply(circle);
    //   }
    //   d3.event.stopPropagation();
    // })
    .attr('r', 0)
    .transition()
    // .ease(d3.easeCubicOut)
    // .duration(500)
    .attr('r', 6);

  focus.selectAll('circle')
    .on('click', function(circle) {
      d3.select(this)
        .transition()
        .ease(d3.easeBounceOut)
        .duration(500)
        .attr('r', 15)
        .transition()
        .duration(500)
        .call(() => {
          if (newConf.onClick) {
            newConf.onClick.apply(circle);
          }
          // d3.event.stopPropagation();
        })
        .delay(500)
        .attr('r', 6); // reset size
      // d3.event.stopPropagation();
  });

  if (newConf.timeFormat && newConf.timeFormat !== '') {
    xAxis.tickFormat((d) => d3.timeFormat(newConf.timeFormat)(d));
  } else {
    // Reset default format
    xAxis.tickFormat(null);
  }

  // if (newConf.intervals || newConf.dateRange) {
  svg.select('.axis--x')
    .transition()
    .duration(500)
    .call(xAxis);
  // }
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
      moment().add(3, typeInt),
    ];
    updateData(conf);
  }, false);
});

document.querySelector('.move-left').addEventListener('click', (e) => {
  const diff = conf.dateRange[1] - conf.dateRange[0];

  conf.dateRange[0].subtract(diff);
  conf.dateRange[1].subtract(diff);
  conf.dateRange[2].subtract(diff);
  updateData(conf);
}, false);

document.querySelector('.move-right').addEventListener('click', (e) => {
  const diff = conf.dateRange[1] - conf.dateRange[0];

  conf.dateRange[0].add(diff);
  conf.dateRange[1].add(diff);
  conf.dateRange[2].add(diff);
  updateData(conf);
}, false);
