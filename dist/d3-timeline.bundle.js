/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var conf = {
  dateRange: [new Date('Jan 2015'), new Date('Dec 2018')],
  intervals: 'Year', // Day, Week, Month, Year
  data: [{ date: new Date('Jan 2015'), label: 'test1' }, { date: new Date('Feb 2016'), label: 'test2' }, { date: new Date('Mar 2016'), label: 'test3' }, { date: new Date('Apr 2017'), label: 'test4' }, { date: new Date('May 2017'), label: 'test5' }, { date: new Date('Jun 2017'), label: 'test6' }, { date: new Date('Jul 2017'), label: 'test7' }]
};

var svg = d3.select('svg');
var margin = { top: 20, right: 20, bottom: 20, left: 30 };
var width = +svg.attr('width') - margin.left - margin.right;
var height = +svg.attr('height') - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]);
x.domain(d3.extent(conf.dateRange));

// timeDay, timeWeek, timeMonth, timeYear
var xAxis = d3.axisBottom(x).ticks(d3['time' + conf.intervals]);
// .tickFormat((d) => d3.timeFormat('%a %d')(d));

// let zoom = d3.zoom()
//     .scaleExtent([1, Infinity])
//     .translateExtent([[0, 0], [width, height]])
//     .extent([[0, 0], [width, height]])
//     .on('zoom', zoomed);

svg.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', width).attr('height', height);

var focus = svg.append('g').attr('class', 'focus').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

focus.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0,' + height + ')').call(xAxis);

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

var circles = focus.selectAll('circle').data(conf.data).enter().append('circle').attr('class', 'dot').attr('r', 5).attr('cx', function (d) {
  return x(d.date);
}).attr('cy', 50);

// focus
//   .selectAll('text')
//   .data(conf.data)
//   .append('text')
//   .attr('transform', (d) => {
//     // console.log(d)
//     return 'translate(' + x(d.date) + ', 0)';
//   })
//   .text((d) => d.label);


var t = d3.transition().duration(1000).ease(d3.easeLinear);

function updateData(newConf) {
  // console.log(newConf);

  // Range
  if (newConf.dateRange) {
    x.domain(d3.extent(newConf.dateRange));
  }

  // Intervals
  if (newConf.intervals) {
    xAxis.ticks(d3['time' + newConf.intervals]);
  }

  circles.remove();

  circles = focus.selectAll('circle').data(newConf.data).enter().append('circle').attr('class', 'dot2').attr('r', 5).attr('cx', function (d) {
    return x(d.date);
  }).attr('cy', 50).on('click', function (circle) {
    if (newConf.callback) {
      newConf.callback.apply(circle);
    }
    d3.event.stopPropagation();
  });

  // if (newConf.intervals || newConf.dateRange) {
  svg.select('.axis--x') // change the x axis
  .transition(t).call(xAxis);
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

  //   // .data(conf2.data)
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

var conf2 = {
  dateRange: [new Date('Jan 2016'), new Date('Dec 2017')],
  intervals: 'Month', // Day, Week, Month, Year
  data: [{ date: new Date('Feb 2017'), label: 'test1' }, { date: new Date('Mar 2017'), label: 'test2' }, { date: new Date('Jun 2017'), label: 'test3' }, { date: new Date('Jul 2017'), label: 'test4' }, { date: new Date('Jul 2018'), label: 'test5' }],
  callback: function callback() {
    alert(this.label);
  }
};

document.querySelectorAll('.interval').forEach(function (e) {
  e.addEventListener('click', function (e) {
    var typeInt = e.target.getAttribute('data-interval');
    conf2.intervals = typeInt;
    updateData(conf2);
  }, false);
});

var days = 365;

document.querySelector('.zoom-in').addEventListener('click', function (e) {
  days -= 50;

  var d0 = new Date();
  var d1 = new Date();
  d1.setDate(d1.getDate() + days);

  conf2.dateRange = [d0, d1];
  updateData(conf2);
}, false);

document.querySelector('.zoom-out').addEventListener('click', function (e) {
  days += 50;

  var d0 = new Date();
  var d1 = new Date();
  d1.setDate(d1.getDate() + days);

  conf2.dateRange = [d0, d1];
  updateData(conf2);
}, false);

/***/ })
/******/ ]);