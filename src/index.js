import React from "react";
import ReactDOM from "react-dom";
import { hot } from 'react-hot-loader'
import ReactEcharts from 'echarts-for-react';  // or var ReactEcharts = require('echarts-for-react');
import { Col,Row,Container,Navbar, Jumbotron, Button } from 'react-bootstrap';
import MidiDeviceList from './midiDeviceList';
import 'bootstrap/dist/css/bootstrap.css';

var mountNode = document.getElementById("app");
var colorArr = ['#1890ff', '#2fc25b', '#facc14', '#223273', '#8543e0', '#13c2c2', '#3436c7', '#f04864'];

var echartsOption = {   title: {
  text: ' '
},
tooltip: {
  trigger: 'axis'
},
legend: { //需要对应 series 的 name值
  data:['天海湾','鼎龙湾','珍珠湾','翠逸家园','紫林湾']
},
color: colorArr,
grid: {
  left: '3%',
  right: '4%',
  bottom: '3%',
  containLabel: true
},
toolbox: {
  feature: {
    dataView : {show: true, readOnly: false},
    magicType : {show: true, type: ['line', 'bar']},
    // saveAsImage: {} //存取为图片
  }
},

xAxis: {
  type: 'category',
  boundaryGap: false,
  data: ['10:00','11:00','12:00','13:00','14:00','15:00','16:00']
},
yAxis: {
  type: 'value'
},
series: [
  {
      name:'A',
      type:'line',
      stack: '总量',
      data:[120, 132, 101, 134, 90, 230, 210]
  },
  {
      name:'B',
      type:'line',
      stack: '总量',
      data:[220, 182, 191, 234, 290, 330, 310]
  },
  {
      name:'C',
      type:'line',
      stack: '总量',
      data:[150, 232, 201, 154, 190, 330, 410]
  },
  {
      name:'D',
      type:'line',
      stack: '总量',
      data:[320, 332, 301, 334, 390, 330, 320]
  },
  {
      name:'E',
      type:'line',
      stack: '总量',
      data:[820, 932, 901, 934, 1290, 1330, 1320]
  }
]} //配置项

class MainApp extends React.Component
{
  render()
  {
    return(
      <Container>
      <Row>
        <h1>MIDI-CONSOLE</h1>
      </Row>
      <Row>
        <MidiDeviceList/>
      </Row>
      <Row>

      </Row>
    </Container>);
  }
}

ReactDOM.render( < MainApp/>, mountNode);
