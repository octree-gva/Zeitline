let conf = {
  dateRange: [
    moment('2017-01-01'),
    moment('2018-01-01'),
  ],
  timeFormat: '%B %e',
  // ticksIntervals: 'Month', // Day, Week, Month, Year
  intervals: [
    [moment('2017-04-01'), moment('2017-06-01'), 350],
    [moment('2017-08-01'), moment('2017-10-01'), 50],
    [moment('2018-08-01'), moment('2018-10-01'), 150],
    // [moment().add(7, 'months'), moment().add(10, 'months'), 100],
  ],
  data: [
    {date: moment().add(10, 'hours'), label: 'test1'},
    {date: moment().add(2, 'days'), label: 'test2'},
    {date: new Date('29 Apr 2017'), label: 'test3a'},
    {date: new Date('29 Apr 2017'), label: 'test3b'},
    {date: new Date('1 May 2017'), label: 'test3c'},
    {date: new Date('10 May 2017'), label: 'test3d 10 May 2017'},
    {date: new Date('25 May 2017'), label: 'test4 25 May 2017'},
    {date: new Date('25 May 2017'), label: 'test4B'},
    {date: new Date('30 May 2017'), label: 'test4C'},
    {date: new Date('10 Jun 2017'), label: 'test_Jun1'},
    {date: new Date('15 Jun 2017'), label: 'test_Jun2'},

    {date: new Date('15 Jun 2017'), label: 'a'},
    {date: new Date('20 Jun 2017'), label: 'a'},
    {date: new Date('25 Jun 2017'), label: 'a'},
    {date: new Date('30 Jun 2017'), label: 'a'},
    {date: new Date('1 Jul 2017'), label: 'a'},
    {date: new Date('5 Jul 2017'), label: 'a'},
    {date: new Date('10 Jul 2017'), label: 'a'},
    {date: new Date('10 Jul 2017'), label: 'a'},
    {date: new Date('10 Jul 2017'), label: 'a'},
    {date: new Date('10 Jul 2017'), label: 'a'},
    {date: new Date('10 Jul 2017'), label: 'a'},
    {date: new Date('10 Jul 2017'), label: 'a'},
    {date: new Date('10 Jul 2017'), label: 'a'},
    {date: new Date('10 Jul 2017'), label: 'a'},
    {date: new Date('15 Jul 2017'), label: 'a'},
    {date: new Date('20 Jul 2017'), label: 'a'},
    {date: new Date('23 Jul 2017'), label: 'a'},
    {date: new Date('24 Jul 2017'), label: 'a'},
    {date: new Date('25 Jul 2017'), label: 'a'},
    {date: new Date('26 Jul 2017'), label: 'a'},
    {date: new Date('27 Jul 2017'), label: 'a'},
    {date: new Date('31 Jul 2017'), label: 'a'},

    {date: new Date('10 Aug 2017'), label: 'test5'},
    {date: new Date('01 Sep 2017'), label: 'test6'},
    {date: new Date('10 Oct 2017'), label: 'test6'},
    {date: new Date('24 Dec 2017'), label: 'test7'},
    {date: new Date('31 Dec 2017'), label: 'test8'},
    {date: new Date('01 Jan 2018'), label: 'test9'},
    {date: new Date('01 Feb 2018'), label: 'test9'},
    {date: new Date('10 May 2018'), label: 'test10'},
    {date: new Date('10 May 2018'), label: 'test11'},
    {date: new Date('25 May 2018'), label: 'test13'},
    {date: new Date('01 Aug 2018'), label: 'test12'},
    {date: new Date('01 Jan 2019'), label: 'test13'},
    {date: new Date('01 Jan 2021'), label: 'test14'},
    {date: new Date('01 Jan 2022'), label: 'test15'},
    {date: new Date('01 Jan 2030'), label: 'test16'},
  ],
    console.log(this); // eslint-disable-line
  onEventClick: function(event) {
    document.querySelector('body').style.background = ['#9b59b6', '#1abc9c', '#f39c12'][Math.floor(Math.random() * 3)];
    setTimeout(() => {
      document.querySelector('body').style.background = '#fff';
    }, 1100);
  },
};

let t = new Zeitline.Timeline(conf);
t.render();
t.update(conf);

// document.querySelectorAll('.interval').forEach((e) => {
//   e.addEventListener('click', (e) => {
//     const typeInt = e.target.getAttribute('data-interval');
//     const ticksInterval = e.target.getAttribute('data-ticks-interval');
//     const timeFormat = e.target.getAttribute('data-time-format');
//     conf.timeFormat = timeFormat;
//     conf.ticksIntervals = ticksInterval;

//     conf.dateRange = [
//       moment(),
//       moment().add(1, typeInt),
//     ];
//     t.update(conf);
//   }, false);
// });

// document.querySelector('.move-left').addEventListener('click', (e) => {
//   const diff = conf.dateRange[1] - conf.dateRange[0];

//   conf.dateRange[0] -= diff;
//   conf.dateRange[1] -= diff;
//   t.update(conf);
// }, false);

// document.querySelector('.move-right').addEventListener('click', (e) => {
//   const diff = conf.dateRange[1] - conf.dateRange[0];

//   conf.dateRange[0] += diff;
//   conf.dateRange[1] += diff;
//   t.update(conf);
// }, false);
