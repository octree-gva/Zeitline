import { assert, expect, use } from "chai";
import * as util from "./util.js";
import * as d3 from "d3";
import spies from "chai-spies";

const chaispy = use(spies);

describe("Timeline events", () => {
  let conf;

  before(() => {
    conf = {
      dateRange: [new Date("2000-01-01"), new Date("2010-01-01")],
      data: [
        { date: new Date("01 Apr 2002"), label: "test 1" },
        { date: new Date("10 Apr 2005"), label: "test 2" },
        { date: new Date("20 Apr 2008"), label: "test 3" },
      ],
      intervals: [[new Date("2002-01-01"), new Date("2008-01-01"), 200]],
      margin: { top: 0, left: 0, right: 0, bottom: 0 },
      eventListeners: {
        click: chaispy.spy(function (event) {}),
      },
      pivotListeners: {
        click: chaispy.spy(function (event) {}),
      },
    };
  });

  let window;
  let pivots;
  let events;
  beforeEach(() => {
    window = util.getWindowWithZeitline(conf);

    pivots = window.document
      .querySelector("svg")
      .querySelectorAll(".pivot-group");

    events = window.document
      .querySelector("svg")
      .querySelectorAll(".event-group");
  });

  it("should dispatch a click on both pivots", () => {
    d3.selectAll(pivots).dispatch("click");
    expect(conf.pivotListeners.click).to.have.been.called.twice;
  });

  it("should dispatch a click on events", () => {
    d3.selectAll(events).dispatch("click");
    expect(conf.eventListeners.click).to.have.been.called.exactly(3);
  });
});
