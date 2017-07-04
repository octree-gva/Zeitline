import React, {Component} from 'react'
import {render} from 'react-dom'

import Zeitline from '../../src'

// const eventsSource = {
//   eventClick(props) {
//     console.log(props);
//   },

//   beginDrag(props) {
//     // Return the data describing the dragged item
//     const item = { id: props.id };
//     return item;
//   }
// };

// Demo with the Zeitline component
class ZeitlineDemo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      numberOfEvents: 1,
      data: [
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
        {date: new Date('01 Jul 2017'), label: 'a'},
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
        {date: new Date('Sep 2017'), label: 'test6'},
        {date: new Date('10 Oct 2017'), label: 'test6'},
        {date: new Date('24 Dec 2017'), label: 'test7'},
        {date: new Date('31 Dec 2017'), label: 'test8'},
        {date: new Date('Jan 2018'), label: 'test9'},
        {date: new Date('Feb 2018'), label: 'test9'},
        {date: new Date('10 May 2018'), label: 'test10'},
        {date: new Date('10 May 2018'), label: 'test11'},
        {date: new Date('25 May 2018'), label: 'test13'},
        {date: new Date('Aug 2018'), label: 'test12'},
        {date: new Date('Jan 2019'), label: 'test13'},
        {date: new Date('Jan 2021'), label: 'test14'},
        {date: new Date('Jan 2022'), label: 'test15'},
        {date: new Date('Jan 2027'), label: 'test16'},
      ]
    };

    this.addEvent = this.addEvent.bind(this);

    this.addInterval = this.addInterval.bind(this);
  }

  addEvent() {
    this.setState({
      ...this.state,
      numberOfEvents: (this.state.numberOfEvents % 30) + 1,
      data: [
        ...this.state.data,
        {
          date: new Date(this.state.numberOfEvents + ' Dec 2017'),
          label: this.state.numberOfEvents
        },
      ],
    });
  }

  addInterval() {
    console.log('interv');

    this.setState({
      ...this.state,
      intervals: [
        ...this.state.intervals,
        [new Date('2017-04-01'), new Date('2017-06-01'), 350],
      ]
    });
  }

  render() {
    console.log('demo', this.state)

    return <div>
      <h1>Zeitline Demo</h1>
      <Zeitline
        width={1000}
        data={this.state.data}
        intervals={this.state.intervals || []}
      />
      <div>
        <button onClick={this.addEvent}>Add an event</button>
        <button onClick={this.addInterval}>Add interval</button>
      </div>
    </div>
  }
}

render(<ZeitlineDemo/>, document.querySelector('#demo'))
