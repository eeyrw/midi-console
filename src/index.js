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
import Album from './Album'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class MainApp extends React.Component
{


  constructor(props) {
    super(props)
  }

 
  render()
  {
    const {classes}=styles;
 
    return(
<React.Fragment>
      <CssBaseline />
<AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" color="inherit">
        MIDI-CONSOLE
        </Typography>
        <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <CloseIcon />
              </IconButton>
      </Toolbar>
    </AppBar>

    <Grid container>
        <Grid item xs={4}>
        <MidiDeviceList />
        </Grid>
        <Grid item xs={8}>
        <VelocityChart/>
        </Grid>

    </Grid> </React.Fragment>);
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render( < MainApp/>, mountNode);
