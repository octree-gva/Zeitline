import { assert } from "chai";
import { getWindowWithZeitline } from "./util.js";

describe("Timeline clustering", () => {
  let conf;

  before(() => {
    conf = {
      dateRange: [new Date("2010-01-01"), new Date("2010-09-01")],
      data: [
        { date: new Date("05 Jan 2010"), label: "A" },
        { date: new Date("11 Jan 2010"), label: "B" },

        { date: new Date("21 Jan 2010"), label: "C" }, // group 1
        { date: new Date("21 Jan 2010"), label: "D" }, // group 1
        { date: new Date("21 Jan 2010"), label: "E" }, // group 1
        { date: new Date("21 Jan 2010"), label: "F" }, // group 1

        { date: new Date("10 Feb 2010"), label: "1" }, // group 2
        { date: new Date("11 Feb 2010"), label: "2" }, // group 2
        { date: new Date("12 Feb 2010"), label: "3" }, // group 2
        { date: new Date("13 Feb 2010"), label: "4" }, // group 2
        { date: new Date("14 Feb 2010"), label: "5" }, // group 2

        { date: new Date("15 Feb 2010"), label: "6" }, // group 3
        { date: new Date("16 Feb 2010"), label: "7" }, // group 3
        { date: new Date("17 Feb 2010"), label: "8" }, // group 3
        { date: new Date("18 Feb 2010"), label: "9" }, // group 3
        { date: new Date("19 Feb 2010"), label: "10" }, // group 3

        { date: new Date("20 Feb 2010"), label: "11" },

        { date: new Date("19 Apr 2010") }, // group 4
        { date: new Date("20 Apr 2010") }, // group 4
        { date: new Date("20 Apr 2010") }, // group 4
        { date: new Date("20 Apr 2010") }, // group 4
        { date: new Date("20 Apr 2010") }, // group 4
        { date: new Date("20 Apr 2010") }, // group 4
        { date: new Date("20 Apr 2010") }, // group 4
        { date: new Date("21 Apr 2010") }, // group 4
        { date: new Date("21 Apr 2010") }, // group 4
        { date: new Date("21 Apr 2010") }, // group 4
      ],
      clustering: { maxSize: 15, epsilon: 20, maxLabelNumber: 9 },
      margin: { top: 0, left: 0, right: 0, bottom: 0 },
    };
  });

  let window;
  let groups;
  beforeEach(() => {
    window = getWindowWithZeitline(conf);

    groups = window.document
      .querySelector("svg")
      .querySelectorAll(".event-group");
  });

  describe("Labels", () => {
    it("should not have a label for one event", () => {
      assert.equal(groups[0].querySelector("text"), undefined);
      assert.equal(groups[1].querySelector("text"), undefined);
    });

    it("should have labels for more than one event", () => {
      assert.equal(groups[2].querySelector("text").innerHTML, "4");
      assert.equal(groups[3].querySelector("text").innerHTML, "4");
      assert.equal(groups[4].querySelector("text").innerHTML, "4");
      assert.equal(groups[5].querySelector("text").innerHTML, "3");
    });

    it("should be never be more than 9 (maxLabelNumber = 9)", () => {
      assert.equal(
        groups[groups.length - 1].querySelector("text").innerHTML,
        "9+"
      );
    });
  });

  describe("Cluster shape", () => {
    it("should have a size bigger than an event", () => {
      assert.isAbove(
        +groups[3].querySelector("rect").getAttribute("width"),
        10
      );
      assert.isAbove(
        +groups[4].querySelector("rect").getAttribute("width"),
        10
      );
    });

    it("should have a max size under 15 pixels", () => {
      assert.isBelow(
        +groups[2].querySelector("rect").getAttribute("width"),
        15
      );
      assert.isBelow(
        +groups[3].querySelector("rect").getAttribute("width"),
        15
      );
      assert.isBelow(
        +groups[4].querySelector("rect").getAttribute("width"),
        15
      );
    });
  });
});
