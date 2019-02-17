'use strict';
window.onunload = function() {
    Cookies.set('WebMidiUserDefinedJs', midiSendScriptEditor.getValue());
}
window.onload = function() {



    var
        divLog = document.getElementById('midiDataLog'),
        divMidiIoControlContainer = document.getElementById('midiIoControlContainer'),
        btnClear = document.getElementById('clearButton'),
        btnSend = document.getElementById('sendButton'),
        btnSave = document.getElementById('saveButton'),
        deviceManageDialog = document.getElementById('deviceManageDialog'),
        midiAccess,
        checkboxMIDIInOnChange,
        checkboxMIDIOutOnChange,
        activeInputs = {},
        activeOutputs = {};
    var midiInputLogItemNum = 0;


    var midiSendScriptEditor = ace.edit("midiSendScriptEditor");
    midiSendScriptEditor.setTheme("ace/theme/tomorrow");
    midiSendScriptEditor.getSession().setMode("ace/mode/javascript");

    btnSend.addEventListener("click", function() {
        for (var portId in activeOutputs) {
            if (activeOutputs.hasOwnProperty(portId)) {
                var port = activeOutputs[portId];
                var midiBytes;
                eval(midiSendScriptEditor.getValue());
            }
        }
    });

    var midiInputDeviceVue = new Vue({
        el: '#inputs',
        data: {
            items: []
        },
        methods: {
            onCheckChange: function(id) { checkboxMIDIInOnChange(id); }
        },
    })
    var midiOutputDeviceVue = new Vue({
        el: '#outputs',
        data: {
            items: []
        },
        methods: {
            onCheckChange: function(id) { checkboxMIDIOutOnChange(id); }
        },
    })

    var app5 = new Vue({
        el: '#show-dialog-btn',
        methods: {
            showDeviceManageDialog: function() {
                deviceManageDialog.showModal();
            },
        }
    });

    var app6 = new Vue({
        el: '#close-dialog-btn',
        methods: {
            closeDeviceManageDialog: function() {
                deviceManageDialog.close();
            },

        }
    });

    btnSave.addEventListener("click", function() {
        var scriptTextBlob = new Blob([midiSendScriptEditor.getValue()], { type: "text/plain;charset=utf-8" });
        saveAs(scriptTextBlob, "midiSendScript.js");
    });

    function clearMidiLog() {
        divLog.innerHTML = "";
        var chartOption = myChart.getOption();
        chartOption.series[0].data = [];
        myChart.setOption(chartOption);
    }

    var userdefinedjs = Cookies.get('WebMidiUserDefinedJs');
    if (userdefinedjs != undefined) {
        midiSendScriptEditor.setValue(userdefinedjs);
    }

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('mainChart'));

    // 指定图表的配置项和数据
    var option = {
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
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    function AddChartItem(theChart, xValue, yValue, barColor) {
        var chartOption = theChart.getOption();

        if (chartOption.series[0].data.length < 40) {
            chartOption.series[0].data.push({ value: yValue, itemStyle: { normal: { color: barColor } } });
            chartOption.xAxis[0].data.push(xValue);
        } else {
            chartOption.series[0].data.shift();
            chartOption.series[0].data.push({ value: yValue, itemStyle: { normal: { color: barColor } } });

            chartOption.xAxis[0].data.shift();
            chartOption.xAxis[0].data.push(xValue);
        }


        theChart.setOption(chartOption);
    }


    if (navigator.requestMIDIAccess !== undefined) {
        navigator.requestMIDIAccess({ sysex: true }).then(

            function onFulfilled(access) {
                midiAccess = access;

                // create list of all currently connected MIDI devices
                showMIDIPorts();

                // update the device list when devices get connected, disconnected, opened or closed
                midiAccess.onstatechange = function(e) {
                    var port = e.port;
                    var div = port.type === 'input' ? divInputs : divOutputs;
                    var listener = port.type === 'input' ? checkboxMIDIInOnChange : checkboxMIDIOutOnChange;
                    var activePorts = port.type === 'input' ? activeInputs : activeOutputs;
                    var checkbox = document.getElementById(port.type + port.id);
                    var label;


                    // device disconnected
                    if (port.state === 'disconnected') {
                        port.close();
                        label = checkbox.parentNode;
                        checkbox.nextSibling.nodeValue = port.name + ' (' + port.state + ', ' + port.connection + ')';
                        checkbox.disabled = true;
                        checkbox.checked = false;
                        delete activePorts[port.type + port.id];

                        // new device connected
                    } else if (checkbox === null) {
                        label = document.createElement('label');
                        checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = port.type + port.id;
                        checkbox.addEventListener('change', listener, false);
                        label.appendChild(checkbox);
                        label.appendChild(document.createTextNode(port.name + ' (' + port.state + ', ' + port.connection + ')'));
                        div.appendChild(label);
                        div.appendChild(document.createElement('br'));



                        // device opened or closed
                    } else if (checkbox !== null) {
                        label = checkbox.parentNode;
                        checkbox.disabled = false;
                        checkbox.nextSibling.nodeValue = port.name + ' (' + port.state + ', ' + port.connection + ')';
                    }
                };
            },

            function onRejected(e) {
                divInputs.innerHTML = e.message;
                divOutputs.innerHTML = '';
            }
        );
    }

    // browsers without WebMIDI API or Jazz plugin
    else {
        divInputs.innerHTML = 'No access to MIDI devices: browser does not support WebMIDI API, please use the WebMIDIAPIShim together with the Jazz plugin';
        divOutputs.innerHTML = '';
    }


    function showMIDIPorts() {
        var
            html,
            checkbox,
            checkboxes,
            inputs, outputs,
            i, maxi;

        inputs = midiAccess.inputs;
        inputs.forEach(function(port) {
            midiInputDeviceVue.items.push({
                friendName: port.name + ' (' + port.state + ', ' + port.connection + ')',
                portId: "midi" + port.type + port.id
            });
        });

        outputs = midiAccess.outputs;
        outputs.forEach(function(port) {
            midiOutputDeviceVue.items.push({
                friendName: port.name + ' (' + port.state + ', ' + port.connection + ')',
                portId: "midi" + port.type + port.id
            });
        });
    }

    function appendMidiEventToLog(time, origin, data) {
        var midiReceviedTime = time.toFixed(5);
        var statusByte = data[0];

        // do something graphical with the incoming midi data
        if ((statusByte != 0xFE) && (statusByte != 0xF8)) {
            midiInputLogItemNum++;
            if (midiInputLogItemNum > 100) {
                clearMidiLog();
                midiInputLogItemNum = 0;
            }
            var itemHtmlString = '';
            if ((statusByte & 0xF0) == 0x90 && (data[2] != 0x00)) {
                var hsl_h = data[1] * 360 / 127;

                hsl_h = (data[1] - 0x24) * 360 / (0x60 - 0x24);

                var hsl_s = data[2] * 100 / 127;
                itemHtmlString = origin + '<span class="midiRealTimeEvent" style="color:hsl(' + hsl_h + ',' + hsl_s + '%,50%)">';
                AddChartItem(myChart, midiReceviedTime, data[2], 'hsl(' + hsl_h + ',100%,50%)');
            } else if ((statusByte & 0xF0) == 0x80) {
                var hsl_h = data[1] * 360 / 127;
                itemHtmlString = '<span class="midiRealTimeEvent" style="color:hsl(' + hsl_h + ',50%,50%)">';
            } else {
                itemHtmlString = '<span class="midiRealTimeEvent">';
            }
            itemHtmlString += (midiReceviedTime + ': ');
            var hexString = '';
            for (var midiByteIndex in data) {
                hexString += sprintf('%02X ', data[midiByteIndex]);
            }

            itemHtmlString += hexString;
            itemHtmlString += '</span><br>';
            divLog.innerHTML += itemHtmlString;
            divLog.scrollTop = divLog.scrollHeight;
        }
    }

    // handle incoming MIDI messages
    function inputListener(midimessageEvent) {
        var port, portId,
            data = midimessageEvent.data;
        var midiReceviedTime = midimessageEvent.receivedTime;


        appendMidiEventToLog(midiReceviedTime, "Input:", data);
    }


    checkboxMIDIInOnChange = function(id) {
        // port id is the same a the checkbox id
        var port = midiAccess.inputs.get(id.replace('input', ''));
        if (this.checked === true) {
            activeInputs[id] = port;
            // implicitly open port by adding an onmidimessage listener
            port.onmidimessage = inputListener;



        } else {
            delete activeInputs[id];
            port.close();
        }
    };


    checkboxMIDIOutOnChange = function(id) {
        // port id is the same a the checkbox id
        var port = midiAccess.outputs.get(id.replace('output', ''));
        if (this.checked === true) {
            activeOutputs[id] = port;
            port.open();
        } else {
            delete activeOutputs[id];
            port.close();
        }
    };





};
