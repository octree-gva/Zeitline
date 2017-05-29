const chai = require('chai');
const assert = chai.assert;
const util = require('./util');

describe('Timeline base', () => {
  let window;
  beforeEach(() => {
    window = util.getWindowWithZeitline();
  });

  describe('Instantiation', () => {
    it('should return an instance of Timeline', () => {
      let t = new window.Zeitline.Timeline();

      assert.equal(t instanceof window.Zeitline.Timeline, true);
    });

    it('should have axis', () => {
      return window.document.querySelector('svg .timeline .axis');
    });

    it('should not have ticks', () => {
      return !window.document.querySelector('svg .timeline .axis .tick');
    });
  });

  describe('Rendering', () => {
    it('should have ticks', () => {
      let t = new window.Zeitline.Timeline();
      t.render();

      return window.document.querySelector('svg .timeline .axis .tick');
    });

    it('should have a domain', () => {
      let t = new window.Zeitline.Timeline();
      t.render();

      return window.document.querySelector('svg .timeline .axis .domain');
    });
  });
});
