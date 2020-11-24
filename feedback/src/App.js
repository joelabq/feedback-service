import React from 'react';
import './App.css';
import Feedback from './Feedback';
import Supervisor from './Supervisor'
import { apiType,currentUser } from './api'


class App extends React.Component {
  constructor(props){
    super(props);
 
    this.state = {
      userInfo: [],
      basicSupervisorInfo: [],
      extendedSupervisorInfo: [],
      subordinates: [],
      isSupervisor: false,
      newFeedback: "",
      viewTracking: "default",
      viewUser: currentUser,
    }
  }

  async runAPICall(type, params) {
    
    let apiCall = "";
    let validQry = false; //only run the fetch if one of these options are matched
    
    ////console.log(`type: ${type} params: ${params.callType} and ${params.userId}`);
    //console.log(typeof(params.userId))
    if (type === 'userMgmtAPI' && params.callType === 'getSupervisor' && Number.isInteger(params.userId)) { 
              //  http://lclhst:3333/supervisor/1 
       apiCall = apiType[`${type}`] + `/supervisor/${params.userId}`;
       validQry = true; 
    }
    else if (type === 'userMgmtAPI' && params.callType === 'getUserInfo' && Number.isInteger(params.userId)) {
      apiCall = apiType[`${type}`] + `/users/${params.userId}`;
      validQry = true; 
    }
    else if (type === 'userMgmtAPI' && params.callType === 'getSubordinates' && Number.isInteger(params.userId)) {
      apiCall = apiType[`${type}`] + `/subordinates/${params.userId}`;
      validQry = true; 
    }
    else if (type === 'feedbackAPI' && params.callType === 'getSubordinates' && Number.isInteger(params.userId)) {
      apiCall = apiType[`${type}`] + `/feedbackSummary/${params.userId}`;
      validQry = true; 
    }

    if (validQry) {
      //console.log("API String -> "+apiCall);
      try {
        const response = await fetch(apiCall); 
        const json = await response.json();
        //console.log("Called API!!",json)
        return json;
      }
      catch(err){
        return "None";
      }
        
     }
     
  }

  async componentDidMount() {
      
    this.setState({userInfo: await this.runAPICall('userMgmtAPI',{callType: "getUserInfo", userId: currentUser}) }) 
    this.setState({basicSupervisorInfo: await this.runAPICall('userMgmtAPI',{callType: "getSupervisor", userId: currentUser}) }) 
    this.setState({extendedSupervisorInfo: await this.runAPICall('userMgmtAPI',{callType: "getUserInfo", userId: Number(this.state.basicSupervisorInfo.supervisorID)}) }) 
    this.setState({subordinates: await this.runAPICall('userMgmtAPI',{callType: "getSubordinates", userId: currentUser}) }) 
    
    let subs = Array.from(this.state.subordinates);
    const subDetails = [];
    
    
    for (let index = 0; index < subs.length; index++) {
      
     
     let apiCall = apiType.userMgmtAPI + `/users/${subs[index].subordinateID}`;
     const response = await fetch(apiCall).then(response => response.json());
     subDetails.push(response)
      
    }
    
    let tempObj = [];

    //console.log("tempobj: ",tempObj)
    this.state.subordinates.map(each => {
        
        let supervisor = subDetails.find(sub => sub.userid === each.subordinateID);
        let recordDate = supervisor.feedbackdate
        tempObj.push({...tempObj,subordinateID:each.subordinateID,DateOfSupervison: each.DateOfSupervison,firstName: supervisor.firstName,
                      lastName: supervisor.lastName})
       return tempObj;                    
     })
    
    this.setState({subordinates: tempObj})
    if (this.state.subordinates.length > 0){
      this.setState({isSupervisor: true, showSupervisorButton: true})
    }
   //console.log("mounted...",tempObj);   
   
  }

  handleViewSubord = () =>{
     this.setState({viewTracking: "subList"});
     
  }

  handleViewMyFeedback = () =>{
    this.setState({viewTracking: "default", viewUser: currentUser});
    
    
 }
  render(){
  
  return (
    <div className="App">
      
      <div className="feedback-user-info">
        <span className="feedback-user-greeting">Welcome, {this.state.userInfo.rank} {this.state.userInfo.firstName} {this.state.userInfo.lastName} </span> 
        <div id="supervisor-block">
         {(this.state.basicSupervisorInfo && this.state.extendedSupervisorInfo) ? 
          <div>
              <span className="feedback-user-super">Supervisor: {this.state.extendedSupervisorInfo.firstName} {this.state.extendedSupervisorInfo.lastName} </span>
              <span className="feedback-user-super">Start of Supervision Date: {this.state.basicSupervisorInfo.DateOfSupervison}</span>
          </div> :
          <div>
             <span className="feedback-user-item">Supervisor not set or not found. Please set in your profile. </span>
           </div> }
          
        </div>
      </div><div><br/></div>
      {(this.state.isSupervisor && this.state.viewTracking == "default")? <button onClick={this.handleViewSubord} className="BUTTON_UXG">View My subordinates</button> : ""}
    
      {this.state.viewTracking == "default"  ? <Feedback viewUser={this.state.viewUser} /> : 
        <button onClick={this.handleViewMyFeedback} className="BUTTON_UXG">View my feedback</button> }
      
        {(this.state.isSupervisor && this.state.viewTracking == "subList") ? 
          <Supervisor subordinates={this.state.subordinates} showFeedbackList={this.state.viewTracking} userInfo={this.state.userInfo} /> 
          : "" }
      
    </div>
  );
  }
}

export default App;
