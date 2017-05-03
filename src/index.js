import * as d3 from 'd3';
import moment from 'moment';

const defaults = {
  dateRange: [
    moment('2017-01-01'),
    moment('2018-01-01'),
  ],
  timeFormat: '%B',
  ticksIntervals: 'Month',
  data: [
  ],
  onClick: function() {
  },
};

export default class Timeline {

  constructor(conf) {
    this.setConf(conf);
    this.init();
  }

  /**
   * Initialize timeline
   */
  init() {
    this.svg = d3.select('svg');
    this.margin = {top: 20, right: 20, bottom: 25, left: 30};
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.timeline = this.svg.append('g')
        .attr('class', 'timeline')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    this.axis = this.timeline.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + this.height + ')');
  }

  /**
   * Set timeline configuration
   *
   * @param {object} conf
   */
  setConf(conf) {
    // Override the default configuration
    Object.assign(this, defaults, conf);
  }

  /**
   * Render x axis
   */
  renderAxis() {
    const pivots = this.getPivots(this.dateRange, this.intervals);

    const range = [0, ...pivots, this.width];
    const domain = this.intervals.reduce((all, int) => all.concat([int[0], int[1]]), []);

    // Create polylinear scale time (from range A to range B with intervals in between)
    this.x = d3.scaleTime()
      .domain([
        d3.extent(this.dateRange)[0],
        ...domain,
        d3.extent(this.dateRange)[1],
      ])
      .range(range); // all pivots

    // Create axis with the given tick interval
    this.xAxis = d3.axisBottom(this.x)
      .ticks(d3[`time${this.ticksIntervals}`]) // timeDay, timeWeek, timeMonth, timeYear
      .tickPadding(-5)
      .tickSize(18);
      // .tickFormat(d3.time.format('%Y'),)

    // Draw axis
    this.axis
      .transition()
      .duration(500)
      .call(this.xAxis);


    // Remove old intervals separation if needed
    this.timeline.selectAll('.reference-line')
      .remove();

    // Draw intervals separation
    range.forEach((pivot) => {
      this.timeline
        .append('line')
        .attr('class', 'linear reference-line')
          .attr('x1', +pivot)
          .attr('x2', +pivot)
          .attr('y1', this.height)
          .attr('y2', this.height - 50);
    });
  }

  /**
   * Compute pivots for intervals based on dateRange
   *
   * @param {array} dateRange
   * @param {array} intervals
   * @return {array} List of pivots (in px)
   */
  getPivots(dateRange, intervals) {
    // Sum intervals size in px
    const intervalsSum = intervals.reduce((sum, interval) => sum + interval[2], 0);

    // Sum intervals duration
    const intervalsDateSum = intervals
      .reduce((duration, interval) => duration.add(interval[1] - interval[0]), moment.duration(0));

    // Create the main scale without intervals
    const xMain = d3.scaleTime()
      .domain(d3.extent([dateRange[0], dateRange[1] - intervalsDateSum]))
      .range([0, this.width - intervalsSum]);

    // Compute each pivot
    return intervals.reduce((res, interval) => {
      const xInterpolate = xMain(interval[0]);
      return {
        pivots: res.pivots.concat([
          xInterpolate + res.eaten,
          xMain(interval[0]) + interval[2] + res.eaten,
        ]),
        // Intervals previously "eaten" (in px)
        eaten: res.eaten + xInterpolate - xMain(interval[1]) + interval[2],
      };
    }, {
      pivots: [],
      eaten: 0,
    }).pivots;
  }

  /**
   * Render data as circles on the timeline
   *
   * @param {array} data
   */
  renderData(data) {
    this.timeline.selectAll('circle')
      // .exit()
      .remove();

    this.timeline.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => this.x(d.date))
      .attr('cy', this.height)
      .attr('r', 0)
      .transition()
      .attr('r', 5);

    let that = this;
    this.timeline.selectAll('circle')
      .on('click', function(circle) {
        d3.select(this)
          .transition()
          .ease(d3.easeBounceOut)
          .duration(500)
          .attr('r', 15)
          .transition()
          .duration(500)
          .call(() => {
            if (that.onClick) {
              that.onClick.apply(circle);
            }
            // d3.event.stopPropagation();
          })
          .delay(500)
          .attr('r', 5); // reset size
    });
  }

  /**
   * Update data
   *
   * @param {object} newConf Configuration
   */
  update(newConf) {
    this.setConf(newConf);

    // Range
    if (newConf.dateRange) {
      this.x.domain(d3.extent(newConf.dateRange));

      // TODO
      // if (newConf.intervals) {
      //   const pivots = this.getPivots(newConf.dateRange, newConf.intervals);
      //   const range = [0, ...pivots, this.width];
      //   this.x.range(range);
      // }
    }

    // Intervals
    if (newConf.ticksIntervals) {
      this.xAxis.ticks(d3[`time${newConf.ticksIntervals}`]);
    }


    this.renderData(newConf.data);

    if (newConf.timeFormat && newConf.timeFormat !== '') {
      this.xAxis.tickFormat((d) => d3.timeFormat(newConf.timeFormat)(d));
    } else {
      // Reset default format
      this.xAxis.tickFormat(null);
    }

    // if (newConf.ticksIntervals || newConf.dateRange) {
    this.renderAxis();
    // this.axis
    //   .transition()
    //   .duration(500)
    //   .call(this.xAxis);
    // }
  }

  /**
   * Render timeline
   */
  render() {
    this.renderAxis();
    this.renderData(this.data);
  }
}

// let t = d3.transition()
//     .duration(500)
//     .ease(d3.easeLinear);

let conf = {
  dateRange: [
    moment('2017-01-01'),
    moment('2018-01-01'),
  ],
  timeFormat: '%B',
  ticksIntervals: 'Month', // Day, Week, Month, Year
  intervals: [
    [moment('2017-04-01'), moment('2017-06-01'), 350],
    [moment('2017-08-01'), moment('2017-10-01'), 50],
    // [moment().add(7, 'months'), moment().add(10, 'months'), 100],
  ],
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
    console.log(this); // eslint-disable-line
    document.querySelector('body').style.background = ['#9b59b6', '#1abc9c', '#f39c12'][Math.floor(Math.random() * 3)];
    setTimeout(() => {
      document.querySelector('body').style.background = '#fff';
    }, 1100);
  },
};

let t = new Timeline(conf);
t.render();
// t.update(conf);

document.querySelectorAll('.interval').forEach((e) => {
  e.addEventListener('click', (e) => {
    let typeInt = e.target.getAttribute('data-interval');
    let ticksInterval = e.target.getAttribute('data-ticks-interval');
    let timeFormat = e.target.getAttribute('data-time-format');
    conf.timeFormat = timeFormat;
    conf.ticksIntervals = ticksInterval;

    conf.dateRange = [
      moment(),
      moment().add(1, typeInt),
    ];
    t.update(conf);
  }, false);
});

document.querySelector('.move-left').addEventListener('click', (e) => {
  const diff = conf.dateRange[1] - conf.dateRange[0];

  conf.dateRange[0].subtract(diff);
  conf.dateRange[1].subtract(diff);
  // conf.dateRange[2].subtract(diff);
  t.update(conf);
}, false);

document.querySelector('.move-right').addEventListener('click', (e) => {
  const diff = conf.dateRange[1] - conf.dateRange[0];

  conf.dateRange[0].add(diff);
  conf.dateRange[1].add(diff);
  t.update(conf);
}, false);
