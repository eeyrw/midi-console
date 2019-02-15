import React from "react";
import { Form,Col,Row,Container,Navbar, Jumbotron, Button } from 'react-bootstrap';
import WebMidi from 'webmidi';
import webmidi from "webmidi";
import PropTypes from 'prop-types';
import { runInThisContext } from "vm";



const CheckBoxArray=({checkBoxList})=>{
   return(checkBoxList.map(item=>(
    <Form.Check 
    disabled={item.disabled}
    checked={item.checked}
        type='checkbox'
        id={item.id}
        label={item.name}
      />)))
}
CheckBoxArray.propTypes = {
  checkBoxList: PropTypes.array
  };
class MidiDeviceList extends React.Component
{
  constructor(props) {
    super(props)
    this.state = {
    ll: [{id:0,name:'dfgdgf',disabled:true,checked:true}]
    }
    }
  componentDidMount()
  {
    this.setState({ll:new Array()});
    this.timerID=setInterval(()=>{
      this.state.ll.push({id:67,name:'dfdd',disabled:true,checked:true})
    this.setState({ll:this.state.ll})
    }
    ,1000)
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  render()
  {
  
   
    return(

         <Container>
      <Row>
        
        <Col>
        <h6>MIDI-IN PORT</h6>
   
        <CheckBoxArray checkBoxList={this.state.ll}/>

        </Col>
        <Col>
        
        <h6>MIDI-OUT PORT</h6>

        
        </Col>
      </Row>

      <Row>

      </Row>
    </Container>);
  }
}

WebMidi.enable(function (err) {

  if (err) {
    console.log("WebMidi could not be enabled.", err);
  }

  webmidi.addListener("connected",(e)=>console.log(e));

  // Viewing available inputs and outputs
  console.log(WebMidi.inputs);
  console.log(WebMidi.outputs);

  // Display the current time
  console.log(WebMidi.time);
  webmidi.MIDI_CHANNEL_MESSAGES
  // Retrieving an output port/device using its id, name or index
  var output = WebMidi.getOutputById("123456789");
  output = WebMidi.getOutputByName("Axiom Pro 25 Ext Out");
  output = WebMidi.outputs[0];

  // Retrieve an input by name, id or index
  var input = WebMidi.getInputByName("nanoKEY2 KEYBOARD");
  input = WebMidi.getInputById("1809568182");
  input = WebMidi.inputs[0];

  // Listen for a 'note on' message on all channels
  input.addListener('noteon', "all",
    function (e) {
      console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
    }
  );

});
export {MidiDeviceList as default}