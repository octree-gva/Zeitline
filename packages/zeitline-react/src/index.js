import React, {Component} from 'react'
import { Timeline } from 'zeitline';

// Zeitline component
export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {conf: {}};
  }

  componentDidMount() {
    this.t = new Timeline({
      selector: this.timelineSvg,
      ...this.props,
      ...this.state.conf
    });

    this.t.render();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.t.update(nextProps);
  }

  render() {
    return (
      <svg
        className="Zeitline"
        width="900"
        height="100"
        ref={(svg) => {this.timelineSvg = svg;}}
      ></svg>
    );
  }
}
