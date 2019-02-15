import React from "react";
import ReactDOM from "react-dom";
import { hot } from 'react-hot-loader'
import ReactEcharts from 'echarts-for-react';  // or var ReactEcharts = require('echarts-for-react');
import { Col,Row,Container,Navbar, Jumbotron, Button } from 'react-bootstrap';
import MidiDeviceList from './midiDeviceList';


class VelocityChart extends React.Component
{
 getOption()
 {
    return({
        title: {
            text: 'NoteOn velocity',
        },
        tooltip: {},
        legend: {
            data: ['Velocity']
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        xAxis: {
            type: 'category',
            name: 'Time',
            boundaryGap: true,
            data: []
        },
        yAxis: {
            type: 'value',
            scale: true,
            name: 'Velocity',
            max: 128,
            min: 0,
            boundaryGap: true
        },
        series: [{
            name: 'Velocity(0~127)',
            type: 'bar',
            data: [],
            animation: false,
            // label:
            // {
            //     normal:
            //     {
            //         show:true,
            //         position:'insideBottom'
            //     }
            // }
        }]
    });
 }
  render()
  {
    return(
        <div>
        <ReactEcharts
        option={this.getOption()}
        style={{height: '600px', width: '100%'}}/>
        </div>);
  }
}

export {VelocityChart as default}