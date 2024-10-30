import React, { Component } from "react";
import { Timeline } from "zeitline";

// Zeitline component
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = { conf: {} };
  }

  componentDidMount() {
    this.t = new Timeline({
      selector: this.timelineSvg,
      ...this.props,
      ...this.state.conf,
    });

    this.t.render();
  }

  componentWillReceiveProps(nextProps) {
    this.t.update(nextProps);
  }

  componentWillUnmount() {
    this.t.destroy();
  }

  render() {
    const { width, height } = this.props;

    return (
      <svg
        className="Zeitline"
        width={width || 500}
        height={height || 100}
        ref={(svg) => {
          this.timelineSvg = svg;
        }}
      ></svg>
    );
  }
}
