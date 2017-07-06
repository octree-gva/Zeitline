import * as d3 from 'd3';
import {throttle} from './utils';

// Default configuration
const defaults = {
  dateRange: [
    new Date(2017, 1, 1),
    new Date(2018, 1, 1),
  ],
  selector: 'svg',
  timeFormat: '%B',
  ticksIntervals: 'Month',
  data: [],
  intervals: [],
  margin: {top: 20, right: 20, bottom: 20, left: 20},
  animation: {time: 300, ease: d3.easePoly},
  clustering: {maxSize: 15, epsilon: 20, maxLabelNumber: 99},
  events: {size: 2},
  dragAndDrop: {throttle: 25, zoneWidth: 15},
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
    this.svg = d3.select(this.selector);
    const {margin, animation} = this;
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
        .attr('transform', `translate(0, ${this.positionY})`)
        .on('click', () => {
          if (this.onTimelineClick) {
            this.onTimelineClick(
              d3.mouse(d3.event.currentTarget)[0],
              this.x.invert(d3.mouse(d3.event.currentTarget)[0])
            );
          }
        });
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
    // Check if configuration is valid
    const mergedConf = this.checkAndNormalizeConf({...defaults, ...conf});

    Object.assign(this, mergedConf);
  }

  /**
   * Check if the configuration is valid and remove empty elements if needed
   *
   * @param {object} conf
   * @return {object} Normalized conf
   */
  checkAndNormalizeConf(conf) {
    if (!conf.dateRange || !conf.dateRange.reduce) {
      throw new TypeError('DateRange should be an array');
    }

    if (!conf.data || !conf.data.reduce) {
      throw new TypeError('Data should be an array');
    }

    if (!conf.intervals || !conf.intervals.reduce) {
      throw new TypeError('Intervals should be an array');
    }

    conf = {
      ...conf,
      dateRange: conf.dateRange.filter(Boolean),
      data: conf.data.filter(Boolean),
      intervals: conf.intervals.filter(Boolean),
    };

    if (conf.dateRange.length < 2) {
      throw new TypeError('Date range should have two dates (start and end)');
    }

    return conf;
  }

  /**
   * Render x axis
   *
   * @param {array} pivots (optional)
   */
  renderAxis(pivots = null) {
    if (pivots === null) {
      pivots = this.getPivots(this.dateRange, this.intervals);
    }
    const domain = this.intervals.reduce((all, int) => all.concat([int[0], int[1]]), []);

    // Create polylinear scale time (from range A to range B with intervals in between)
    const getScaleTime = () => d3.scaleTime()
      .domain([
        d3.extent(this.dateRange)[0],
        ...domain,
        d3.extent(this.dateRange)[1],
      ])
      .range([0, ...pivots, this.width]); // all pivots

    this.x = getScaleTime();

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

    const pivotsGroup = this.timeline.selectAll('.pivot-group')
      .data(pivots, (d) => +d);

    // Condition to avoid pivots overlapping
    const isOverlapping = (pivots, index, x, margin) =>
      x - margin <= (pivots[index - 1] || 0) || x + margin >= (pivots[index + 1] || this.width);

    // Function to render events via throttle
    const throttleEventRender = throttle(() => {
      pivots[lastPivotIndex] = lastPivotX;

      this.x = getScaleTime();
      this.renderData(this.data);
    }, this.dragAndDrop.throttle);

    // Draw intervals separation
    const that = this;
    let lastPivotX;
    let lastPivotIndex;
    const pivotsGroupEnter = pivotsGroup.enter()
      .filter((pivot) => pivot > 0 && pivot < this.width)
      .append('g')
        .attr('class', 'pivot-group')
        .attr('transform', (pivot) => `translate(${pivot + .5}, ${this.positionY - 30})`)
      .call(d3.drag()
        .on('start', (x) => {
          lastPivotIndex = pivots.indexOf(x);
        })
        .on('drag', function(x) {
          if (!isOverlapping(pivots, lastPivotIndex, d3.event.x, 10)) {
            lastPivotX = d3.event.x;

            d3.select(this)
              .classed('draggable', true)
              .attr('transform', `translate(${lastPivotX}, ${that.positionY - 30})`);

            // Render events with the new pivot position after throttle
            throttleEventRender();
          }
        })
        .on('end', (x) => {
          if (lastPivotX && !isOverlapping(pivots, lastPivotIndex, lastPivotX, 9)) {
            pivots[lastPivotIndex] = lastPivotX;
            this.renderAxis(pivots);
            this.renderData(this.data);
          }
        })
      );

    pivotsGroupEnter
      .append('rect')
        .attr('fill-opacity', 0)
        .attr('x', - this.dragAndDrop.zoneWidth / 2)
        .attr('width', this.dragAndDrop.zoneWidth)
        .attr('height', 60);

    pivotsGroupEnter
      .append('line')
      .attr('class', 'linear reference-line reference-interval')
        .attr('stroke', '#000')
        .attr('stroke-width', 2)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', 60);

    // Remove old pivots if needed
    pivotsGroup.exit()
      .remove();

    // Add special reference line for today
    const todayLine = this.timeline.selectAll('.reference-line-today.reference-line')
      .data([this.x(new Date())], (d) => d);

    todayLine.enter()
      .append('line')
      .attr('class', 'linear reference-line reference-line-today')
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('x1', (pivot) => pivot + .5)
        .attr('x2', (pivot) => pivot + .5)
        .attr('y1', this.positionY - 30)
        .attr('y2', this.positionY);

    todayLine.exit()
      .remove();
  }

  /**
   * Register a callback on timeline click
   *
   * @param {any} callback
   */
  onTimelineClick(callback) {
    this.onTimelineClick = callback;
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
      // Domain will be reduce from (date A to date Z) to (date A to (date Z - intervals time))
      .domain(d3.extent([dateRange[0], dateRange[1] - intervalsDateSum]))
      // Range (size of the axis) will be reduce from full width to full width minus intervals size
      .range([0, this.width - intervalsSum]);

    // Compute each pivot
    // A pivot represent the start or the end of an interval
    return intervals.reduce(({pivots, eaten}, interval) => {
      // Projection of the start of the given interval on the main axis along with the
      // addition of the "eaten" intervals
      const xInterpolate = xMain(interval[0]) + eaten;

      // We calculate a new interval and add it to our pivots
      return {
        pivots: pivots.concat([
          // Start of the interval
          xInterpolate,
          // End of the interval (start of the interval + size of the interval)
          xInterpolate + interval[2],
        ]),
        // Intervals previously "eaten" (in px)
        eaten: xInterpolate - xMain(interval[1]) + interval[2],
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
    let dataTime = data
      .map((d) => [this.x(d.date), d.label, d.date])
      .sort((a, b) => a[0] - b[0]);

    dataTime = dataTime.reduce(({firstInCluster, eaten, acc}, x, i, xs) => {
      if (firstInCluster === null) {
        firstInCluster = x;
      } else {
        const prec = xs[i-1][0] || 0;

        // Squared interval between xi-1 and xi
        const intAB = Math.pow(x[0] - prec, 2);

        // Difference between x0 and xi+1
        const intAZ = prec - firstInCluster[0];

        if (intAB > this.clustering.epsilon || intAZ > this.clustering.maxSize) {
          // We end the current cluster
          // [firstEvent date (number), interval first-last events, first event, last event]
          acc.push([firstInCluster[0], intAZ, firstInCluster, xs[i-1], eaten]);
          firstInCluster = x;
          eaten = 0;
        }
      }

      if (i + 1 === xs.length) {
        acc.push([firstInCluster[0], x[0] - firstInCluster[0]]);
      }

      return {
        firstInCluster,
        eaten: eaten + 1,
        acc,
      };
    }, {
      firstInCluster: null,
      eaten: 0,
      acc: [],
    }).acc;

    const events = this.timeline.selectAll('.event-group')
      .data(dataTime, (d) => d);

    const eventsSize = this.events.size;

    const eventsEnter = events
      .enter()
      .append('g')
        .attr('class', 'event-group')
        .attr('transform', (d) =>
          `translate(${d[0] - eventsSize + .5}, ${this.positionY - eventsSize + .5})`)
        .style('font-size', '10px')
        .style('font-family', 'sans-serif');

    const maxLabelNumber = this.clustering.maxLabelNumber;
    eventsEnter
      .filter((d) => d[4] > 1) // Show the number on top of clusters with 2+ elements
      .append('text')
        .text((d) => d[4] < maxLabelNumber + 1 ? d[4] : maxLabelNumber + '+')
        .attr('dy', -5)
        .attr('dx', (d) => d[1] / 2 + 2) // Center text on top of the cluster
        .attr('text-anchor', 'middle');

    eventsEnter
      .filter((d) => d[0] > 0 && d[0] < this.width)
      .append('rect')
        .attr('class', 'event')
        .attr('rx', eventsSize)
        .attr('ry', eventsSize)
        .attr('width', (d) => eventsSize * 2 + d[1])
        .attr('height', eventsSize * 2);

    // eventsEnter
    //   .merge(events)
    //     .attr('height', 0)
    //     .transition(this.transition)
    //     .attr('height', eventsSize * 2);

    // Draw events
    this.timeline.selectAll('.event-group')
      .on('click', (event) => {
        d3.select(d3.event.target)
          // .transition(this.transition)
          // .attr('height', 15)
          .transition(this.transition)
          .call(() => {
            if (this.onEventClick) {
              // Override d3 event with custom fields
              const customEvent = d3.event;
              customEvent.axisX = event[0];
              customEvent.clusterSize = event[1];
              customEvent.labels = [event[2][1], event[3][1]];
              customEvent.dates = [event[2][2], event[3][2]];

              this.onEventClick(customEvent);
            }
            // d3.event.stopPropagation();
          })
          .delay(500);
          // .attr('height', 6); // reset size
    });

    // Remove out of frame events
    events
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

    if (newConf.data) {
      this.renderData(newConf.data);
    }
  }

  /**
   * Render timeline
   */
  render() {
    this.renderAxis();
    this.renderData(this.data);
  }

  /**
   * Destroy
   */
  destroy() {
    setTimeout(() => {
      this.svg.remove();
    }, 0);
  }
}

