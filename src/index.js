import React from "react";
import ReactDOM from "react-dom";
import { hot } from 'react-hot-loader'
import ReactEcharts from 'echarts-for-react';  // or var ReactEcharts = require('echarts-for-react');
import { Col,Row,Container,Navbar, Jumbotron, Button } from 'react-bootstrap';
import MidiDeviceList from './midiDeviceList';
import VelocityChart from './velocityChart';
import 'bootstrap/dist/css/bootstrap.css';

var mountNode = document.getElementById("app");

class MainApp extends React.Component
{
  
  render()
  {
    const midiDeviceListElement=<MidiDeviceList/>
    const velocityChartElement=<VelocityChart/>
   console.log(velocityChartElement)
    return(
      <Container>
      <Row>
        <h1>MIDI-CONSOLE</h1>
        { velocityChartElement.getOption()}
      </Row>
      <Row>
        {midiDeviceListElement}
      </Row>
      <Row>
<VelocityChart/>
      </Row>
    </Container>);
  }
}

ReactDOM.render( < MainApp/>, mountNode);
