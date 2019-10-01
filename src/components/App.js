import React from "react";
import { Form } from "react-final-form";

class App extends React.Component {
  state = {
    sessionData: {},
    formData: {}
  };

  sessionIDRef = React.createRef();
  domainRef = React.createRef();
  DFTRef = React.createRef();
  FSRRef = React.createRef();
  BDTRef = React.createRef();
  ADPRef = React.createRef();
  PAYRef = React.createRef();
  COARef = React.createRef();

  handleSubmit = (key, event) => {
    event.preventDefault();
  };

  getSessionData = (key, event) => {
    const info = {
      sessionID: this.sessionIDRef.current.value,
      domain: this.domainRef.current.value,
      step: key
    };
    
    fetch("https://api.myjson.com/bins/lddf1")
      .then(res => res.json())
      .then(
        (result) => {
          this.setSessionData(result);
          this.setFormData(info);
        },
        (error) => {
          this.setSessionData(error)
        }
      );

  };

  setSessionData = (aux) => {
    const sessionData = { ...this.state.sessionData };
    sessionData[0] = JSON.stringify(aux);
    this.setState({ sessionData });
  };

  updateSessionData = (updatedSession) => {
    const sessionData = { ...this.state.sessionData };
    sessionData[0] = updatedSession;
    this.setState({ sessionData });
  };

  setFormData = (aux) => {
    const formData = { ...this.state.formData };
    formData[0] = aux;
    this.setState({ formData });
  };

  handleChange = event => {
    const updatedSession = {
      ...this.props.sessionData,
      [event.currentTarget.name]: event.currentTarget.value
    };
    this.updateSessionData(updatedSession);
  };

  render() {
    return (
      <Form
      onSubmit={this.handleSubmit}
      render={({ submitting, pristine }) => (
      <form onSubmit={this.handleSubmit}>
        <div className="table-content">
          <div className="table-left">
            <ul className="menu">
              <li><button type="button" className="menu-item" onClick={() => this.getSessionData("DFT")}>P1</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionData("FSR")}>P2</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionData("BDT")}>P3</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionData("ADP")}>P3.5</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionData("PAY")}>P4</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionData("COA")}>P5</button></li>
            </ul>
          </div>
          <div className="table-right">
            <div className="row">
              <span className="mr5">Session ID</span><input type="text" size="50" name="sessionID" ref={this.sessionIDRef} required/>
            </div>
            <div className="row">
              <span className="mr5">Domain</span><input type="text" size="50" name="domain" ref={this.domainRef} required/>
            </div>
            <div className="row">
              <textarea 
                name="jsonViewer" 
                className="jsonViewer" 
                cols="100" rows="34" 
                value={Object.keys(this.state.sessionData).map(key => (this.state.sessionData[key]))} 
                onChange={this.handleChange}
                readOnly></textarea>
            </div>
          </div>
        </div>
      </form>
      )}
      />
    );
  }
}

export default App;
