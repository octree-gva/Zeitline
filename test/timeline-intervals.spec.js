const chai = require('chai');
const assert = chai.assert;
const util = require('./util');

describe('Timeline intervals', () => {
  let conf;

  before(() => {
    conf = {
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
  });

  let separations, window;

  beforeEach(() => {
    window = util.getWindowWithZeitline(conf);

    separations = window.document.querySelector('svg')
      .querySelectorAll('.reference-interval');
  });

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
