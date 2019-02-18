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

class CheckBoxGroup extends React.Component {
  handleChange = (name, id) => event => {
    let onChange = this.props.onChange;
    onChange(name, id, event.target.checked);
  };
  render() {
    return (
      <FormGroup>
        {this.props.checkBoxPropsList.map(item => (
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
CheckBoxGroup.propTypes = {
  checkBoxPropsList: PropTypes.array,
  onChange: PropTypes.func
};

class MidiDeviceList extends React.Component {
  constructor(props) {
    super(props);
    this.deviceList = [];
    this.selectedDeviceFlagList = {};
    this.state = {
      checkBoxGroupPropsListForMidiIn: [],
      checkBoxGroupPropsListForMidiOut: []
    };
    this.onSelectedDeviceListChange = this.onSelectedDeviceListChange.bind(
      this
    );
    this.selectedMidiInDeviceList = [];
    this.selectedMidiOutDeviceList = [];
  }

  onSelectedDeviceListChange(name, id, checked) {
    console.log("NAME:" + name + " ID:" + id + " Checked:" + checked);
    this.selectedDeviceFlagList[id] = checked;
    this.selectedMidiInDeviceList = this.deviceList
      .filter(
        item =>
          item.port.type == "input" &&
          this.selectedDeviceFlagList[item.port.id] == true
      )
      .map(item => WebMidi.getInputById(item.port.id));
    this.selectedMidiOutDeviceList = this.deviceList
      .filter(
        item =>
          item.port.type == "output" &&
          this.selectedDeviceFlagList[item.port.id] == true
      )
      .map(item => WebMidi.getOutputById(item.port.id));

    changedDeviceType = _.find(this.deviceList, o => o.port.id == id).port.type;
    if (changedDeviceType == "input")
      this.props.onSelectedMidiInPortChange(this.selectedMidiInDeviceList);
    else if (changedDeviceType == "output")
      this.props.onSelectedMidiOutPortChange(this.selectedMidiOutDeviceList);
  }
  updateMidiInOutPortList() {
    [
      { stateField: "checkBoxGroupPropsListForMidiIn", portType: "input" },
      { stateField: "checkBoxGroupPropsListForMidiOut", portType: "output" }
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
            {this.state.checkBoxGroupPropsListForMidiIn.length != 0 ? (
              <CheckBoxGroup
                checkBoxPropsList={this.state.checkBoxGroupPropsListForMidiIn}
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
            {this.state.checkBoxGroupPropsListForMidiOut.length != 0 ? (
              <CheckBoxGroup
                checkBoxPropsList={this.state.checkBoxGroupPropsListForMidiOut}
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

MidiDeviceList.propTypes = {
  onSelectedMidiInPortChange: PropTypes.func,
  onSelectedMidiOutPortChange: PropTypes.func
};

export { MidiDeviceList as default };
