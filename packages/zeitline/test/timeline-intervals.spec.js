import { assert } from "chai";
import { getWindowWithZeitline } from "./util.js";

describe("Timeline intervals", () => {
  let conf;

  before(() => {
    conf = {
      dateRange: [new Date("2000-01-01"), new Date("2010-01-01")],
      intervals: [[new Date("2002-01-01"), new Date("2008-01-01"), 200]],
      margin: { top: 0, left: 0, right: 0, bottom: 0 },
    };
  });

  let window;
  let separations;
  beforeEach(() => {
    window = getWindowWithZeitline(conf);

    separations = window.document
      .querySelector("svg")
      .querySelectorAll(".pivot-group");
  });

  const intervalX = (i) =>
    +separations[i].getAttribute("transform").match(/([0-9\.]+)/)[0];

  it("should render 2 intervals", () => {
    assert.equal(separations.length, 2);
  });

  it("should have 200px between intervals", () => {
    // cast in integer to avoid float error
    assert.equal((intervalX(1) - intervalX(0)) | 0, 200);
  });

  it("should render centered interval", () => {
    const timelineWidth = window.document
      .querySelector("svg")
      .getAttribute("width");

    const sumIntervals = (intervalX(0) + intervalX(1)) | 0;

    // +-5 px near the center
    assert.isAbove(timelineWidth - sumIntervals, -5);
    assert.isBelow(timelineWidth - sumIntervals, 5);
  });
});
