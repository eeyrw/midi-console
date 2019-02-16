import React from "react";
import ReactDOM from "react-dom";
import MidiDeviceList from './midiDeviceList';
import VelocityChart from './velocityChart';
import WebMidi from 'webmidi';
import webmidi from "webmidi";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

class MainApp extends React.Component
{

  constructor(props) {
    super(props)
  }

 
  render()
  {
 
    return(
      <div>
<CssBaseline />
<AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" color="inherit">
        MIDI-CONSOLE
        </Typography>
      </Toolbar>
    </AppBar>

    <Grid container spacing={24}>
        <Grid item xs={4}>
        <MidiDeviceList />
        </Grid>
        <Grid item xs={8}>
        <VelocityChart/>
        </Grid>

    </Grid></div>);
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render( < MainApp/>, mountNode);
