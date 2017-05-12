import * as d3 from 'd3';

// Default configuration
const defaults = {
  dateRange: [
    new Date(2017, 1, 1),
    new Date(2018, 1, 1),
  ],
  timeFormat: '%B',
  ticksIntervals: 'Month',
  data: [],
  intervals: [],
  onClick: () => {},
  options: {
      margin: {top: 20, right: 20, bottom: 20, left: 20},
      animation: {time: 300, ease: d3.easePoly},
  },
};

/**
 * Timeline class
 *
 * @export
 * @class Timeline
 */
export default class Timeline {

  /**
   * Creates an instance of Timeline
   *
   * @param {object} conf Configuration
   */
  constructor(conf) {
    this.setConf(conf);
    this.init();
  }

  /**
   * Initialize timeline
   */
  init() {
    this.svg = d3.select('svg');
    const {margin, animation} = this.options;
    this.width = +this.svg.attr('width') - margin.left - margin.right;
    this.height = +this.svg.attr('height') - margin.top - margin.bottom;
    this.positionY = this.height / 1.4;
    this.timeline = this.svg.append('g')
        .attr('class', 'timeline')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    this.axisLabels = this.timeline.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${this.positionY})`);
    this.axisTicks = this.timeline.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${this.positionY})`);
    this.transition = d3.transition()
      .duration(animation.time)
      .ease(animation.ease instanceof String ? d3[animation.ease] : animation.ease);
  }

  /**
   * Set timeline configuration
   *
   * @param {object} conf
   */
  setConf(conf = {}) {
    // Override the default configuration
    if (conf.options) {
      conf.options = Object.assign({}, defaults.options, conf.options);
    }
    Object.assign(this, defaults, conf);
  }

  /**
   * Render x axis
   */
  renderAxis() {
    const pivots = this.getPivots(this.dateRange, this.intervals);
    const domain = this.intervals.reduce((all, int) => all.concat([int[0], int[1]]), []);

    // Create polylinear scale time (from range A to range B with intervals in between)
    this.x = d3.scaleTime()
      .domain([
        d3.extent(this.dateRange)[0],
        ...domain,
        d3.extent(this.dateRange)[1],
      ])
      .range([0, ...pivots, this.width]); // all pivots

    // Create axis with the given tick interval
    const xAxisLabel = d3.axisBottom(this.x)
      .tickFormat(d3.timeFormat(this.timeFormat))
      .tickValues([new Date(), ...domain])
      .tickPadding(-50)
      .tickSize(0)
      .tickSizeOuter(.5);

    const xAxisTicks = d3.axisBottom(this.x)
      .ticks(d3[`time${this.ticksIntervals}`]) // timeDay, timeWeek, timeMonth, timeYear
      .tickFormat('')
      .tickPadding(-70)
      .tickSize(20)
      .tickSizeOuter(.5);

    // Draw axis
    this.axisLabels
      .transition(this.transition)
      .call(xAxisLabel);

    // Draw axis
    this.axisTicks
      .transition(this.transition)
      .call(xAxisTicks);

    let lines = this.timeline.selectAll('.reference-line')
      .data(pivots, (d) => +d);

    // Draw intervals separation
    lines.enter()
      .append('line')
      .attr('class', 'linear reference-line')
        .attr('x1', (pivot) => pivot + .5)
        .attr('x2', (pivot) => pivot + .5)
        .attr('y1', this.positionY - 30)
        .attr('y2', this.positionY + 30);

    // Add special reference line for today
    let todayLine = this.timeline.selectAll('.reference-line-today.reference-line')
      .data([this.x(new Date())], (d) => d);

    todayLine.enter()
      .append('line')
      .attr('class', 'linear reference-line reference-line-today')
        .attr('x1', (pivot) => pivot + .5)
        .attr('x2', (pivot) => pivot + .5)
        .attr('y1', this.positionY - 30)
        .attr('y2', this.positionY);

    // Remove old intervals separation if needed
    lines.exit()
      .remove();
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
      .reduce((duration, interval) => duration += interval[1] - interval[0], 0);

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
   * @param {array} data Array of objects
   */
  renderData(data) {
    let circles = this.timeline.selectAll('circle')
      .data(data, (d) => d);

    // Draw circles
    circles
      .enter()
      .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => this.x(d.date))
        .attr('cy', this.positionY + .5)
      .merge(circles)
        .attr('r', 0)
        .transition(this.transition)
        .attr('r', 4);

    this.timeline.selectAll('circle')
      .on('click', (circle) => {
        d3.select(d3.event.target)
          .transition(this.transition)
          .attr('r', 15)
          .transition(this.transition)
          .call(() => {
            if (this.onClick) {
              this.onClick.apply(circle);
            }
            // d3.event.stopPropagation();
          })
          .delay(500)
          .attr('r', 4); // reset size
    });

    // Remove out of frame circles
    circles
      .exit()
      .remove();
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
    // if (newConf.ticksIntervals) {
    //   this.xAxis.ticks(d3[`time${newConf.ticksIntervals}`]);
    // }

    // if (newConf.timeFormat && newConf.timeFormat !== '') {
    //   // this.xAxis.tickFormat((d) => d3.timeFormat(newConf.timeFormat)(d));
    // } else {
    //   // Reset default format
    //   // this.xAxis.tickFormat(null);
    // }

    // if (newConf.ticksIntervals || newConf.dateRange) {
    this.renderAxis();
    // this.axis
    //   .transition()
    //   .duration(500)
    //   .call(this.xAxis);
    // }

    this.renderData(newConf.data);
  }

  /**
   * Render timeline
   */
  render() {
    this.renderAxis();
    this.renderData(this.data);
  }
}

