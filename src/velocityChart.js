import React from 'react';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';

class VelocityChart extends React.Component {
    constructor(props) {
                         super(props);
                         this.state = this.getInitialState();
                       }
      timeTicket = null;
      count = 51;
      getInitialState = () => ({option: this.getOption()});
    
      fetchNewDate = () => {
        let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
        const option = _.cloneDeep(this.state.option); // immutable



        if (option.series[0].data.length < 40) {
            option.series[0].data.push({ value: Math.round(Math.random() * 128), itemStyle: { normal: { color: 'red' } } });
            option.xAxis.data.push(axisData);
        } else {
            option.series[0].data.shift();
            option.series[0].data.push({ value: Math.round(Math.random() * 128), itemStyle: { normal: { color: 'red' } } });

            option.xAxis.data.shift();
            option.xAxis.data.push(axisData);
        }


    
        this.setState({
          option,
        });
      };
    
      componentDidMount() {
        // if (this.timeTicket) {
        //   clearInterval(this.timeTicket);
        // }
        // this.timeTicket = setInterval(this.fetchNewDate, 1000);
      };
    
      componentWillUnmount() {
        if (this.timeTicket) {
          clearInterval(this.timeTicket);
        }
      };
    
      getOption = () => ({
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
        visualMap: {
            show: true,
            min: 0,
            max: 128,
            color: ['#BE002F', '#F20C00', '#F00056', '#FF2D51', '#FF2121', '#FF4C00', '#FF7500',
              '#FF8936', '#FFA400', '#F0C239', '#FFF143', '#FAFF72', '#C9DD22', '#AFDD22',
              '#9ED900', '#00E500', '#0EB83A', '#0AA344', '#0C8918', '#057748', '#177CB0']
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

  render() {
    return (
      <div className='examples'>
        <div className='parent'>
          <ReactEcharts ref='echarts_react'
            option={this.state.option}
            style={{height: 400}} />
        </div>
      </div>
    );
  }
}


export {VelocityChart as default}