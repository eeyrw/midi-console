import React from "react";
import _ from "lodash";
import ReactEcharts from "echarts-for-react";
import WebMidi from "webmidi";
import webmidi from "webmidi";
import PropTypes from "prop-types";

class VelocityChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { option: this.getOption() };
    this.onNoteOn = this.onNoteOn.bind(this);
  }

  addDataPoint = (xValue, yValue, barColor) => {
    let axisData = xValue;
    const option = _.cloneDeep(this.state.option); // immutable

    if (!(option.series[0].data.length < 40)) {
      option.xAxis.data.shift();
      option.series[0].data.shift();
    }
    option.series[0].data.push({
      value: yValue,
      itemStyle: { normal: { color: barColor } }
    });
    option.xAxis.data.push(axisData);

    this.setState({
      option
    });
  };

  onNoteOn(e) {
    let vel = e.rawVelocity;
    let pitch = e.note.number;
    let time = (e.timestamp / 1000).toFixed(5);
    var hsl_h = (pitch * 360) / 127;

    hsl_h = ((pitch - 0x24) * 360) / (0x60 - 0x24);

    this.addDataPoint(time, vel, "hsl(" + hsl_h + ",100%,50%)");
  }
  componentDidMount() {
    this.props.inputPorts.map(port =>
      port.addListener("noteon", "all", this.onNoteOn)
    );
  }

  componentWillUnmount() {
    this.props.inputPorts.map(port =>
      port.removeListener("noteon", "all", this.onNoteOn)
    );
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.inputPorts !== prevProps.inputPorts) {
      prevProps.inputPorts.map(port =>
        port.removeListener("noteon", "all", this.onNoteOn)
      );
      this.props.inputPorts.map(port =>
        port.addListener("noteon", "all", this.onNoteOn)
      );
    }
  }

  getOption = () => ({
    title: {
      text: "NoteOn velocity"
    },
    tooltip: {},
    legend: {
      data: ["Velocity"]
    },
    dataZoom: {
      show: false,
      start: 0,
      end: 100
    },
    xAxis: {
      type: "category",
      name: "Time",
      boundaryGap: true,
      data: []
    },
    yAxis: {
      type: "value",
      scale: true,
      name: "Velocity",
      max: 128,
      min: 0,
      boundaryGap: true
    },
    series: [
      {
        name: "Velocity(0~127)",
        type: "bar",
        data: [],
        animation: false
      }
    ]
  });

  render() {
    return (
      <div>
        <ReactEcharts
          ref="echarts_react"
          option={this.state.option}
          style={{ height: 400 }}
        />
      </div>
    );
  }
}

VelocityChart.propTypes = {
  inputPorts: PropTypes.array
};

export { VelocityChart as default };
