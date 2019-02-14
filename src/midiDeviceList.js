import React from "react";
import { Form,Col,Row,Container,Navbar, Jumbotron, Button } from 'react-bootstrap';




class MidiDeviceList extends React.Component
{
  render()
  {

    var midiInDevCheckList=new Array();
    for (let index = 0; index < 5; index++) {
        
      midiInDevCheckList.push(<Form.Check 
        type='checkbox'
        id={`default-checkbox`}
        label={`default checkbox`}
      />);

}

    return(

         <Container>
      <Row>
        
        <Col>
        <h6>MIDI-IN PORT</h6>
   


        </Col>
        <Col>
        
        <h6>MIDI-OUT PORT</h6>
        {midiInDevCheckList}
        
        </Col>
      </Row>

      <Row>

      </Row>
    </Container>);
  }
}


export {MidiDeviceList as default}