import React from "react";
import ReactDOM from "react-dom";
import MidiDeviceList from "./midiDeviceList";
import VelocityChart from "./velocityChart";
import WebMidi from "webmidi";
import webmidi from "webmidi";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MaximizeIcon from "@material-ui/icons/Maximize";
import MinimizeIcon from "@material-ui/icons/Minimize";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    height: "100%",
    color: theme.palette.text.secondary
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.onSelectedMidiInPortChange = this.onSelectedMidiInPortChange.bind(
      this
    );
    this.onSelectedMidiOutPortChange = this.onSelectedMidiOutPortChange.bind(
      this
    );
    this.state = { midiInPortList: [], midiOutPortList: [] };
  }

  onSelectedMidiInPortChange(e) {
    this.setState({ midiInPortList: e });
  }

  onSelectedMidiOutPortChange(e) {
    this.setState({ midiOutPortList: e });
  }
  render() {
    console.log(this.state);
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              MIDI-CONSOLE
            </Typography>
            <IconButton aria-haspopup="true" color="inherit">
              <MinimizeIcon />
            </IconButton>
            <IconButton aria-haspopup="true" color="inherit">
              <MaximizeIcon />
            </IconButton>
            <IconButton aria-haspopup="true" color="inherit">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container className={classes.root}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <MidiDeviceList
                onSelectedMidiInPortChange={this.onSelectedMidiInPortChange}
                onSelectedMidiOutPortChange={this.onSelectedMidiOutPortChange}
              />
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <VelocityChart inputPorts={this.state.midiInPortList} />
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MainApp);
