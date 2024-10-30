import { assert } from "chai";
import { getWindow, getWindowWithZeitline } from "./util.js";

describe("Timeline base", () => {
  let window;

  beforeEach(() => {
    window = getWindowWithZeitline();
  });

  describe("Instantiation", () => {
    it("should return an instance of Timeline", () => {
      let t = new window.Zeitline.Timeline();
      assert.equal(t instanceof window.Zeitline.Timeline, true);
    });

    it("should have axis", () => {
      assert.isNotNull(window.document.querySelector("svg .timeline .axis"));
    });

    // it("should not have ticks", () => {
    //   assert.isNull(window.document.querySelector("svg .timeline .axis .tick"));
    // });
  });

  describe("Rendering", () => {
    const renderTimeline = () => {
      let t = new window.Zeitline.Timeline();
      t.render();
    };

    it("should have ticks", () => {
      renderTimeline();
      assert.isNotNull(
        window.document.querySelector("svg .timeline .axis .tick")
      );
    });

    it("should have a domain", () => {
      renderTimeline();
      assert.isNotNull(
        window.document.querySelector("svg .timeline .axis .domain")
      );
    });
  });
});
