import React from "react";
import WebMidi from "webmidi";
import webmidi from "webmidi";
import PropTypes from "prop-types";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";

class CheckBoxArray extends React.Component {
  handleChange = (name, id) => event => {
    let onChange = this.props.onChange;
    onChange(name, id, event.target.checked);
  };
  render() {
    return (
      <FormGroup>
        {this.props.checkBoxList.map(item => (
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={false}
                onChange={this.handleChange(item.name, item.id)}
                value={item.name}
                disabled={item.disabled}
              />
            }
            label={item.name}
          />
        ))}
      </FormGroup>
    );
  }
}
CheckBoxArray.propTypes = {
  checkBoxList: PropTypes.array,
  onChange: PropTypes.func
};

class MidiDeviceList extends React.Component {
  constructor(props) {
    super(props);
    this.deviceList = [];
    this.selectedDeviceList = {};
    this.state = { midiInPortList: [], midiOutPortList: [] };
    this.onSelectedDeviceListChange = this.onSelectedDeviceListChange.bind(
      this
    );
    this.selectedMidiInDeviceList = [];
    this.selectedMidiOutDeviceList = [];
  }

  onSelectedDeviceListChange(name, id, checked) {
    console.log("NAME:" + name + " ID:" + id + " Checked:" + checked);
    this.selectedDeviceList[id] = checked;
    this.selectedMidiInDeviceList = this.deviceList
      .filter(
        item =>
          item.port.type == "input" &&
          this.selectedDeviceList[item.port.id] == true
      )
      .map(item => WebMidi.getInputById(item.port.id));
    this.selectedMidiOutDeviceList = this.deviceList
      .filter(
        item =>
          item.port.type == "output" &&
          this.selectedDeviceList[item.port.id] == true
      )
      .map(item => WebMidi.getOutputById(item.port.id));
  }
  updateMidiInOutPortList() {
    [
      { stateField: "midiInPortList", portType: "input" },
      { stateField: "midiOutPortList", portType: "output" }
    ].map(updateItem => {
      let portList = this.deviceList
        .filter(item => item.port.type == updateItem.portType)
        .map(item => {
          return {
            disabled: item.port.state != "connected",
            id: item.port.id,
            name: item.port.name
          };
        });
      this.setState({ [updateItem.stateField]: portList });
    });
  }

  onConnected(e) {
    let deviceId = e.port.id;
    let deviceIndex = _.findIndex(this.deviceList, o => o.port.id == deviceId);
    if (deviceIndex > -1) this.deviceList[deviceIndex] = e;
    else this.deviceList.push(e);
    this.updateMidiInOutPortList();
  }
  onDisconnected(e) {
    let deviceId = e.port.id;
    let deviceIndex = _.findIndex(this.deviceList, o => o.port.id == deviceId);
    if (deviceIndex > -1) this.deviceList[deviceIndex] = e;
    else this.deviceList.push(e);
    this.updateMidiInOutPortList();
  }
  componentDidMount() {
    let mainThis = this;

    WebMidi.enable(function(err) {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      }
      webmidi.addListener("connected", e => mainThis.onConnected(e));
      webmidi.addListener("disconnected", e => mainThis.onDisconnected(e));
    });
  }

  componentWillUnmount() {
    WebMidi.enable(function(err) {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      }
      webmidi.removeListener("connected");
      webmidi.removeListener("disconnected");
    });
  }
  render() {
    return (
      <Grid container>
        <Grid item xs>
          <FormControl component="fieldset">
            <FormLabel component="legend">MIDI-IN PORT</FormLabel>
            {this.state.midiInPortList.length != 0 ? (
              <CheckBoxArray
                checkBoxList={this.state.midiInPortList}
                onChange={this.onSelectedDeviceListChange}
              />
            ) : (
              <Typography align="center">NO INPUT DEVICE.</Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs>
          <FormControl component="fieldset">
            <FormLabel component="legend">MIDI-OUT PORT</FormLabel>
            {this.state.midiOutPortList.length != 0 ? (
              <CheckBoxArray
                checkBoxList={this.state.midiOutPortList}
                onChange={this.onSelectedDeviceListChange}
              />
            ) : (
              <Typography align="center">NO OUTPUT DEVICE.</Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

// WebMidi.enable(function (err) {

//   if (err) {
//     console.log("WebMidi could not be enabled.", err);
//   }

//   webmidi.addListener("connected",(e)=>console.log(e));

//   // Viewing available inputs and outputs
//   console.log(WebMidi.inputs);
//   console.log(WebMidi.outputs);

//   // Display the current time
//   console.log(WebMidi.time);
//   webmidi.MIDI_CHANNEL_MESSAGES
//   // Retrieving an output port/device using its id, name or index
//   var output = WebMidi.getOutputById("123456789");
//   output = WebMidi.getOutputByName("Axiom Pro 25 Ext Out");
//   output = WebMidi.outputs[0];

//   // Retrieve an input by name, id or index
//   var input = WebMidi.getInputByName("nanoKEY2 KEYBOARD");
//   input = WebMidi.getInputById("1809568182");
//   input = WebMidi.inputs[0];

//   // Listen for a 'note on' message on all channels
//   input.addListener('noteon', "all",
//     function (e) {
//       console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
//     }
//   );

// });
export { MidiDeviceList as default };
