const fs = require('fs');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const chai = require('chai');
const assert = chai.assert;
const Zeitline = fs.readFileSync('./dist/zeitline.bundle.js', {encoding: 'utf-8'});

const dom = `<html>
<body>
  <svg width="1000" height="100"></svg>
</body>
</html>`;

const {window} = new JSDOM(dom, {runScripts: 'dangerously'});

const scriptEl = window.document.createElement('script');
scriptEl.textContent = Zeitline;
window.document.body.appendChild(scriptEl);


describe('Timeline base', () => {
  describe('Instanciation', () => {
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


describe('Timeline intervals', () => {
  const conf = {
    dateRange: [
      new Date('2000-1-1'),
      new Date('2010-1-1'),
    ],
    intervals: [
      [
        new Date('2001-1-1'),
        new Date('2009-1-1'),
        200,
      ],
    ],
    options: {
      margin: {top: 0, left: 0, right: 0, bottom: 0},
    },
  };

  let t = new window.Zeitline.Timeline(conf);
  t.render();

  const separations = window.document.querySelector('svg')
    .querySelectorAll('.reference-interval');

  const intervalX = (i) => +separations[i].getAttribute('x1');

  it('should render 2 intervals', () => {
    assert.equal(separations.length, 2);
  });

  it(`should have 200px between intervals`, () => {
    // cast in integer to avoid float error
    assert.equal((intervalX(1) - intervalX(0)) | 0, 200);
  });

  it('should render centered interval', () => {
    const timelineWidth = window.document.querySelector('svg').getAttribute('width');

    // +-5 px near the center
    assert.isAbove(timelineWidth - (intervalX(0) + intervalX(1)) | 0, -5);
    assert.isBelow(timelineWidth - (intervalX(0) + intervalX(1)) | 0, 5);
  });
});
