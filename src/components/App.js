import React from "react";
import { Form } from "react-final-form";
import Cookies from 'universal-cookie';
import Beautify from 'json-beautify';
class App extends React.Component {
  state = {
    sessionData: {},
    formData: {}
  }; 
  
  sessionIDRef = React.createRef();
  DFTRef = React.createRef();
  FSRRef = React.createRef();
  BDTRef = React.createRef();
  ADPRef = React.createRef();
  PAYRef = React.createRef();
  COARef = React.createRef();

  handleSubmit = (key, event) => {
    event.preventDefault();
  };

  getSessionStepData = (key, event) => {
    const info = {
      sessionID: this.sessionIDRef.current.value,
      step: key
    };
    
    const headersTest = new Headers();
    headersTest.set("Cookie", `ASP.NET_SessionId=${info.sessionID}; path=/; domain=localhost; Expires=Tue, 19 Jan 2038 03:14:07 GMT;`);

     fetch(`http://localhost:49506/Session/GetCurrentSessionSsi`,{     
      method: 'GET',
      headers: headersTest,
      credentials:'include'
     })    
      .then(res => res.json())
      .then(
        (result) => {
          fetch(`http://localhost:49506/Session/GetCurrentSessionFacadeValue?ssi=${result}&value=Flight.Step${info.step}AsJson`,{     
          method: 'GET',
          headers: headersTest,
          credentials:'include'
        })    
          .then(res => res.json())
          .then(
            (result) => {
              this.setSessionData(Beautify(result, null, 2, 100));
              this.setFormData(info);
            },
            (error) => {
              this.setSessionData(error)
            }
          );
            },
            (error) => {
              console.log(error);
            }
          );
  }; 

  setSessionCookie = (key, event) => {
    const info = {
      sessionID: this.sessionIDRef.current.value,
      step: key
    };     
    const cookies = new Cookies();
    cookies.remove('ASP.NET_SessionId');
    cookies.set('ASP.NET_SessionId', `${info.sessionID}`, { path: '/'}); 
  };

  getSessionData = (key, event) => {
    const info = {
      sessionID: this.sessionIDRef.current.value,
      step: key
    };
    const headersTest = new Headers();
    headersTest.set("Cookie", `ASP.NET_SessionId=${info.sessionID}; path=/; domain=localhost; Expires=Tue, 19 Jan 2038 03:14:07 GMT;`);

     fetch(`http://localhost:49506/Session/GetCurrentSessionSsi`,{     
      method: 'GET',
      headers: headersTest,
      credentials:'include'
     })    
      .then(res => res.json())
      .then(
        (result) => {
          fetch(`http://localhost:49506/Session/GetCurrentSessionFacade?ssi=${result}`,{     
          method: 'GET',
          headers: headersTest,
          credentials:'include'
        })    
          .then(res => res.json())
          .then(
            (result) => {
              this.setSessionData(Beautify(result, null, 2, 100));
              this.setFormData(info);
            },
            (error) => {
              this.setSessionData(error)
            }
          );
            },
            (error) => {
              console.log(error);
            }
          );
  };

  setSessionData = (aux) => {
    const sessionData = { ...this.state.sessionData };
    sessionData[0] = aux;
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
              <li><button type="button" className="menu-item" onClick={() => this.getSessionStepData("DFT")}>P1</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionStepData("FSR")}>P2</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionStepData("BDT")}>P3</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionStepData("ADP")}>P3.5</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionStepData("PAY")}>P4</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionStepData("COA")}>P5</button></li>
              <li><button type="button" className="menu-item" onClick={() => this.getSessionData()}>SD</button></li>
            </ul>
          </div>
          <div className="table-right">
            <div className="row">
              <span className="mr5">Session ID</span><input type="text" size="50" name="sessionID" ref={this.sessionIDRef} required/>
              <button type="button" onClick={() => this.setSessionCookie()}>SetCookie</button>
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
