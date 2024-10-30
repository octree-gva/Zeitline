let conf = {
  dateRange: [new Date("01 Jan 2017"), new Date("01 Jan 2018")],
  timeFormat: "%B %e",
  // ticksIntervals: 'Month', // Day, Week, Month, Year
  intervals: [
    [new Date("2017-04-01"), new Date("2017-06-01"), 350],
    [new Date("2017-08-01"), new Date("2017-10-01"), 50],
    [new Date("2018-08-01"), new Date("2018-10-01"), 150],
  ],
  data: [
    { date: new Date() },
    { date: new Date("29 Apr 2017") },
    { date: new Date("29 Apr 2017") },
    { date: new Date("01 May 2017") },
    { date: new Date("10 May 2017") },
    { date: new Date("25 May 2017") },
    { date: new Date("25 May 2017") },
    { date: new Date("30 May 2017") },
    { date: new Date("10 Jun 2017") },
    { date: new Date("15 Jun 2017") },
    { date: new Date("15 Jun 2017") },
    { date: new Date("20 Jun 2017") },
    { date: new Date("25 Jun 2017") },
    { date: new Date("30 Jun 2017") },
    { date: new Date("01 Jul 2017") },
    { date: new Date("05 Jul 2017") },
    { date: new Date("08 Jul 2017") },
    { date: new Date("09 Jul 2017") },
    { date: new Date("09 Jul 2017") },
    { date: new Date("10 Jul 2017") },
    { date: new Date("10 Jul 2017") },
    { date: new Date("10 Jul 2017") },
    { date: new Date("10 Jul 2017") },
    { date: new Date("10 Jul 2017") },
    { date: new Date("11 Jul 2017") },
    { date: new Date("12 Jul 2017") },
    { date: new Date("13 Jul 2017") },
    { date: new Date("14 Jul 2017") },
    { date: new Date("16 Jul 2017") },
    { date: new Date("17 Jul 2017") },
    { date: new Date("15 Jul 2017") },
    { date: new Date("20 Jul 2017") },
    { date: new Date("23 Jul 2017") },
    { date: new Date("24 Jul 2017") },
    { date: new Date("25 Jul 2017") },
    { date: new Date("26 Jul 2017"), label: "test1" },
    { date: new Date("27 Jul 2017"), label: "test2" },
    { date: new Date("31 Jul 2017"), label: "test3" },
    { date: new Date("10 Aug 2017"), label: "test4" },
    { date: new Date("01 Sep 2017"), label: "test5" },
    { date: new Date("10 Oct 2017"), label: "test6" },
    { date: new Date("24 Dec 2017"), label: "test7" },
    { date: new Date("31 Dec 2017"), label: "test8" },
    { date: new Date("01 Jan 2018"), label: "test9" },
    { date: new Date("01 Feb 2018"), label: "test9" },
    { date: new Date("10 May 2018"), label: "test10" },
    { date: new Date("10 May 2018"), label: "test11" },
    { date: new Date("25 May 2018"), label: "test13" },
    { date: new Date("01 Aug 2018"), label: "test12" },
    { date: new Date("01 Jan 2019"), label: "test13" },
    { date: new Date("01 Jan 2021"), label: "test14" },
    { date: new Date("01 Jan 2022"), label: "test15" },
    { date: new Date("01 Jan 2030"), label: "test16" },
  ],
  eventListeners: {
    click: function (event) {
      console.log(event); // eslint-disable-line
      document.querySelector("body").style.background = [
        "#9b59b6",
        "#1abc9c",
        "#f39c12",
      ][Math.floor(Math.random() * 3)];
      setTimeout(() => {
        document.querySelector("body").style.background = "#fff";
      }, 1000);
    },
  },
  pivotListeners: {
    start: function (event) {
      console.log("start", event); // eslint-disable-line
    },
    end: function (event) {
      console.log("end", event); // eslint-disable-line
    },
    click: function (e) {
      console.log("click", e); // eslint-disable-line
    },
  },
};

var t = new Zeitline.Timeline(conf); // eslint-disable-line
t.render();
