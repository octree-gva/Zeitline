import * as d3 from "./partial-d3.js";
import { throttle } from "./utils.js";

// Default configuration
const defaults = {
  dateRange: [new Date(2017, 0, 0), new Date(2018, 0, 0)],
  selector: "svg",
  timeFormat: "%B",
  ticksIntervals: "Month",
  data: [],
  intervals: [],
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  animation: { time: 300, ease: d3.easePoly },
  clustering: { maxSize: 20, epsilon: 20, maxLabelNumber: 99 },
  events: { size: 2 },
  dragAndDrop: { throttle: 25, zoneWidth: 15 },
};

/**
 * Timeline class
 *
 * @export
 * @public
 * @class Timeline
 * @author Fabien Sa
 */
export default class Timeline {
  /**
   * Creates an instance of Timeline
   *
   * @constructor
   * @public
   * @param {object} conf Configuration
   */
  constructor(conf) {
    this.setConf(conf);
    this.init();
  }

  /**
   * Initialize timeline
   *
   * Create the svg node, the axis and calculate the margins & positions
   *
   * @protected
   */
  init() {
    this.svg = d3.select(this.selector);
    const { margin, animation } = this;
    this.width = +this.svg.attr("width") - margin.left - margin.right;
    this.height = +this.svg.attr("height") - margin.top - margin.bottom;
    this.positionY = this.height / 1.4;
    this.timeline = this.svg
      .append("g")
      .attr("class", "timeline")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const axisBase = () =>
      this.timeline
        .append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0, ${this.positionY})`);
    this.axisLabels = axisBase();
    this.axisTicks = axisBase();

    if (this.timelineAxisListeners) {
      // Add events listeners to pivots
      for (const key in this.timelineAxisListeners) {
        if (this.timelineAxisListeners.hasOwnProperty(key)) {
          this.axisTicks.on(key, (event) =>
            this.timelineAxisListeners[key](event)
          );
        }
      }
    }

    this.animationTime = animation.time;
    this.animationEase =
      animation.ease instanceof String ? d3[animation.ease] : animation.ease;
  }

  /**
   * Set timeline configuration
   *
   * @protected
   * @param {object} conf Configuration
   */
  setConf(conf = {}) {
    // Check if configuration is valid
    const mergedConf = this.checkAndNormalizeConf({ ...defaults, ...conf });

    Object.assign(this, mergedConf);
  }

  /**
   * Check if the configuration is valid, reorder or remove empty elements if needed
   *
   * @protected
   * @param {object} conf Configuration to check and normalize
   * @throws {TypeError} If dateRange, data or intervals are not arrays
   * @throws {Error} If intervals overlaps
   * @throws {Error} If dateRange does not have 2 dates
   * @return {object} Normalized conf
   */
  checkAndNormalizeConf(conf) {
    if (!conf.dateRange || !conf.dateRange.reduce) {
      throw new TypeError("DateRange should be an array");
    }

    if (!conf.data || !conf.data.reduce) {
      throw new TypeError("Data should be an array");
    }

    if (!conf.intervals || !conf.intervals.reduce) {
      throw new TypeError("Intervals should be an array");
    }

    conf = {
      ...conf,
      dateRange: conf.dateRange.filter(Boolean),
      data: conf.data.filter(Boolean),
      intervals: conf.intervals.filter(Boolean),
    };

    // Order inner intervals range if needed
    // Interval [Date B, Date A] will be switched to [Date A, Date B]
    // (with Date A < Date B)
    conf.intervals = conf.intervals.map((interval) =>
      interval[0] - interval[1] > 0
        ? [interval[1], interval[0], interval[2]]
        : interval
    );

    // Check if an interval does not overlap an other one
    const isTheirAnOverlap = !conf.intervals.reduce(
      (prev, curr, i, arr) =>
        arr[i + 1] === undefined ? prev : prev && curr[1] - arr[i + 1][0] < 0,
      true
    );

    if (isTheirAnOverlap) {
      throw new Error("Intervals are not valid because an overlap exist");
    }

    if (conf.dateRange.length !== 2) {
      throw new Error("Date range should have two dates (start and end)");
    }

    if (conf.dateRange[0] > conf.dateRange[1]) {
      throw new Error(
        "The starting date should be smaller than the ending date"
      );
    }

    return conf;
  }

  /**
   * Render x axis
   * Render the polylinear x axis with ticks and pivots and registered events callbacks
   *
   * @protected
   * @param {array} pivots (optional) List of pivots, if empty, pivots will be calculated
   * from the `intervals` option
   */
  renderAxis(pivots = null) {
    // Filter intervals and remove out of date range values
    const intervalsInRange = this.intervals.filter(
      (int) => int[1] > this.dateRange[0] && int[0] < this.dateRange[1]
    );

    if (pivots === null) {
      pivots = this.getPivots(this.dateRange, intervalsInRange);
    }

    // Create a domain with the dates from intervals
    let domain = intervalsInRange.reduce(
      (all, int) => all.concat([int[0], int[1]]),
      []
    );

    // Create polylinear scale time (from range A to range B with intervals in between)
    const getScaleTime = () =>
      d3
        .scaleTime()
        .domain([this.dateRange[0], ...domain, this.dateRange[1]])
        .range([0, ...pivots, this.width]); // all pivots

    this.x = getScaleTime();

    // Create axis with the given tick interval
    const xAxisLabel = d3
      .axisBottom(this.x)
      .tickFormat(d3.timeFormat(this.timeFormat))
      .tickValues([new Date(), ...domain])
      .tickPadding(-50)
      .tickSize(0)
      .tickSizeOuter(0.5);

    const xAxisTicks = d3
      .axisBottom(this.x)
      .ticks(d3[`time${this.ticksIntervals}`]) // timeDay, timeWeek, timeMonth, timeYear
      .tickFormat("")
      .tickPadding(-70)
      .tickSize(20)
      .tickSizeOuter(0.5);

    // Interrupts the active transition on the given element
    const interruptElement = (el) => el.interrupt().selectAll("*").interrupt();

    interruptElement(this.axisLabels);
    interruptElement(this.axisTicks);

    // Draw axis
    this.axisLabels
      .transition()
      .duration(this.animationTime)
      .ease(this.animationEase)
      .call(xAxisLabel);
    // this.axisLabels.transition(this.transition).call(xAxisLabel);

    // Draw axis
    this.axisTicks
      .transition()
      .duration(this.animationTime)
      .ease(this.animationEase)
      .call(xAxisTicks);
    // this.axisTicks.transition(this.transition).call(xAxisTicks);

    const pivotsGroup = this.timeline
      .selectAll(".pivot-group")
      .data(pivots, (d) => +d);

    // Condition to avoid pivots overlapping
    const isOverlapping = (pivots, index, x, margin) =>
      x - margin <= (pivots[index - 1] || 0) ||
      x + margin >= (pivots[index + 1] || this.width);

    // Function to render events via throttle
    const throttleEventRender = throttle(() => {
      pivots[lastPivotIndex] = lastPivotX;

      this.x = getScaleTime();
      this.renderData(this.data);
      this.renderAxis(pivots);
    }, this.dragAndDrop.throttle);

    // Draw intervals separation
    const that = this;
    let lastPivotX;
    let lastPivotIndex;
    let lastPivotEl;
    const pivotsGroupEnter = pivotsGroup
      .enter()
      .filter((pivot) => pivot > 0 && pivot < this.width)
      .append("g")
      .attr("class", "pivot-group")
      .attr(
        "transform",
        (pivot) => `translate(${pivot + 0.5}, ${this.positionY - 30})`
      )
      .call(
        d3
          .drag()
          .on("start", (event, d, i) => {
            lastPivotIndex = pivots.indexOf(d);
            lastPivotEl = d3.select(event.sourceEvent.target);

            if (this.pivotListeners && this.pivotListeners.start) {
              this.pivotListeners.start(event);
            }
          })
          .on("drag", (event) => {
            if (!isOverlapping(pivots, lastPivotIndex, event.x, 10)) {
              lastPivotX = event.x;

              console.log(event.x);

              lastPivotEl
                .classed("draggable", true)
                .attr(
                  "transform",
                  `translate(${lastPivotX}, ${that.positionY - 30})`
                );

              pivots[lastPivotIndex] = lastPivotX;
              console.log(pivots[lastPivotIndex]);

              if (that.pivotListeners && that.pivotListeners.drag) {
                that.pivotListeners.drag(event);
              }

              // Render events with the new pivot position after throttle
              throttleEventRender();
            }
          })
          .on("end", (event, x) => {
            if (
              lastPivotX &&
              !isOverlapping(pivots, lastPivotIndex, lastPivotX, 9)
            ) {
              pivots[lastPivotIndex] = lastPivotX;
              this.renderAxis(pivots);
              this.renderData(this.data);

              if (this.pivotListeners && this.pivotListeners.end) {
                this.pivotListeners.end(event);
              }
            }
          })
      );

    pivotsGroupEnter
      .append("rect")
      .attr("fill-opacity", 0)
      .attr("x", -this.dragAndDrop.zoneWidth / 2)
      .attr("width", this.dragAndDrop.zoneWidth)
      .attr("height", 60);

    pivotsGroupEnter
      .append("line")
      .attr("class", "linear reference-line reference-interval")
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", 60);

    if (this.pivotListeners) {
      // Add events listeners to pivots
      for (const key in this.pivotListeners) {
        if (this.pivotListeners.hasOwnProperty(key)) {
          pivotsGroupEnter.on(key, (event) => this.pivotListeners[key](event));
        }
      }
    }

    // Remove old pivots if needed
    pivotsGroup.exit().remove();

    // Add special reference line for today
    const todayLine = this.timeline
      .interrupt()
      .selectAll(".reference-line-today.reference-line")
      .interrupt()
      .data([this.x(new Date())], (d) => d);

    todayLine
      .enter()
      .append("line")
      .attr("class", "linear reference-line reference-line-today")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("x1", (pivot) => pivot + 0.5)
      .attr("x2", (pivot) => pivot + 0.5)
      .attr("y1", this.positionY - 30)
      .attr("y2", this.positionY - this.events.size);

    todayLine.exit().remove();
  }

  /**
   * Compute pivots for intervals from date A to B based on `dateRange`
   *
   * @protected
   * @param {array} dateRange List of date A and date B
   * @param {array} intervals List of [date A, date B, width (in pixel)]
   * @return {array} List of pivots on the x axis (in pixel)
   */
  getPivots(dateRange, intervals) {
    // Sum intervals size in px
    const intervalsSum = intervals.reduce(
      (sum, interval) => sum + interval[2],
      0
    );

    // Sum intervals duration
    const intervalsDateSum = intervals.reduce(
      (duration, interval) => (duration += interval[1] - interval[0]),
      0
    );

    // Create the main scale without intervals
    const xMain = d3
      .scaleTime()
      // Domain will be reduce from (date A to date Z) to (date A to (date Z - intervals time))
      .domain(d3.extent([dateRange[0], dateRange[1] - intervalsDateSum]))
      // Range (size of the axis) will be reduce from full width to full width minus intervals size
      .range([0, this.width - intervalsSum]);

    // Compute each pivot
    // A pivot represent the start or the end of an interval
    return intervals.reduce(
      ({ pivots, eaten }, interval) => {
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
      },
      {
        pivots: [],
        eaten: 0,
      }
    ).pivots;
  }

  /**
   * @private
   * @param {Object[]} data
   * @param {Date} data[].date
   * @param {string=} data[].label
   * @return {[number, number, [number, string?, Date], [number, string?, Date], number][]}
   */
  dateTimeFromData(data) {
    const dataTime = data
      .map((d) => [this.x(d.date), d.label, d.date])
      .sort((a, b) => a[0] - b[0]);

    return dataTime.reduce(
      ({ firstInCluster, eaten, acc }, x, i, xs) => {
        if (firstInCluster === null) {
          firstInCluster = x;
        } else {
          const prec = xs[i - 1][0] || 0; // xi-1

          // Squared interval between xi-1 and xi
          const intAB = Math.pow(x[0] - prec, 2);

          // Difference between x0 and xi-1
          const intAZ = prec - firstInCluster[0];

          // Difference between x0 and xi
          const intAZ2 = x[0] - firstInCluster[0];

          if (
            intAB > this.clustering.epsilon ||
            intAZ2 > this.clustering.maxSize
          ) {
            // We end the current cluster
            // [firstEvent date (number), interval first-last events, first event, last event]
            acc.push([
              firstInCluster[0],
              intAZ,
              firstInCluster,
              xs[i - 1],
              eaten,
            ]);
            firstInCluster = x;
            eaten = 0;
          }
        }

        // Cluster size of one event
        if (i + 1 === xs.length) {
          acc.push([firstInCluster[0], 0, firstInCluster, null, eaten + 1]);
        }

        return {
          firstInCluster,
          eaten: eaten + 1,
          acc,
        };
      },
      {
        firstInCluster: null,
        eaten: 0,
        acc: [],
      }
    ).acc;
  }

  /**
   * Render data events as circles or clusters on the timeline and register events callbacks
   *
   * @public
   * @param {Object[]} data Array of data events objects (`{date: ..., label?: ...}`)
   * @param {Date} data[].date
   * @param {string=} data[].label
   */
  renderData(data) {
    const dataTime = this.dateTimeFromData(data);

    const events = this.timeline
      .selectAll(".event-group")
      .data(dataTime, (d) => d);

    const eventsSize = this.events.size;

    const eventsEnter = events
      .enter()
      .append("g")
      .attr("class", "event-group")
      // Use the "label" key in defined data
      .attr("data-label-start", (d) => d[2][1] || "")
      .attr("data-label-end", (d) => (d[3] || [])[1] || "")
      .attr(
        "transform",
        (d) =>
          `translate(${d[0] - eventsSize + 0.5}, ${
            this.positionY - eventsSize + 0.5
          })`
      )
      .style("font-size", "10px")
      .style("font-family", "sans-serif");

    const maxLabelNumber = this.clustering.maxLabelNumber;
    eventsEnter
      .filter((d) => d[4] > 1) // Show the number on top of clusters with 2+ elements
      .append("text")
      .text((d) => (d[4] < maxLabelNumber + 1 ? d[4] : maxLabelNumber + "+"))
      .attr("dy", -5)
      .attr("dx", (d) => (d[1] === 0 ? 0 : d[1] / 2)) // Center text on top of the cluster
      .attr("text-anchor", "middle")
      .attr("pointer-events", "auto");

    eventsEnter
      .filter((d) => d[0] > 0 && d[0] < this.width)
      .append("rect")
      .attr("class", "event")
      .attr("x", (d) => (d[1] === 0 ? -eventsSize : 0))
      .attr("rx", eventsSize)
      .attr("ry", eventsSize)
      .attr("width", (d) => Math.max(d[1], eventsSize * 2))
      .attr("height", eventsSize * 2);

    if (this.eventListeners) {
      // Add events listeners to events
      for (const key in this.eventListeners) {
        if (this.eventListeners.hasOwnProperty(key)) {
          eventsEnter.on(key, (event, d) => {
            const getEventRange = (index) => [
              d[2][index],
              d[3] ? d[3][index] : null,
            ];

            // Override d3 event with custom fields
            const customEvent = {
              ...event,
              axisX: d[0],
              clusterSize: d[1],
              labels: getEventRange(1),
              dates: getEventRange(2),
            };

            this.eventListeners[key](customEvent);
          });
        }
      }
    }

    // Remove out of frame events
    events.exit().remove();
  }

  /**
   * Update the timeline with the new configuration
   *
   * @public
   * @param {object} newConf New configuration with new data or options
   */
  update(newConf) {
    this.setConf(newConf);

    if (newConf.length === 1 && newConf.data) {
      this.renderData(this.data);
    } else {
      this.renderAxis();
      this.renderData(this.data);
    }
  }

  /**
   * Render the entire timeline
   *
   * @public
   */
  render() {
    this.renderAxis();
    this.renderData(this.data);
  }

  /**
   * Destroy the timeline, remove the svg node
   *
   * @public
   */
  destroy() {
    setTimeout(() => {
      this.svg.remove();
    }, 0);
  }
}
