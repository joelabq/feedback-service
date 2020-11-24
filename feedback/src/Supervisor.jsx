import React from 'react'
import { apiType,currentUser } from './api'
import Feedback from './Feedback';
import SupervisorFeedback from './SupervisorFeedback'

class Supervisor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            feedback: [],
            currentSubordinate: 0,
        }
    }
    
    async handleViewFeedback(subID){
        
        let apiCall = apiType.feedbackAPI + `/feedback/${subID}`;
        const response = await fetch(apiCall).then(response => response.json());
        
        this.setState({showFeedbackForm: true, feedback: response, currentSubordinate: subID});
        //console.log("API: ", apiCall)
 
      }  
    
    async handleViewFeedbackList(subID){
        
         let apiCall = apiType.feedbackAPI + `/feedbackSummary/${subID}`;
         const response = await fetch(apiCall).then(response => response.json());
        
         this.setState({showFeedbackForm: true, currentSubordinate: subID, feedback: response});
        //console.log("API: ", apiCall)
        
    }
    render(){
        
        if (this.props.showFeedbackList && !this.state.showFeedbackForm){
           
            let sub = this.props.subordinates.map(each => (<tr><td>
                                        <button onClick={() => this.handleViewFeedbackList(each.subordinateID)} 
                                                className="BUTTON_UXG">Feedback</button></td>
                                        <td>{each.firstName} {each.lastName} </td> 
                                        <td>{each.DateOfSupervison}
                                        </td> </tr>))
            
            return(
                <div>
                    <table className="feedback-supervisor-table">
                    <tr className="feedback-supervisor-table-header">
                        <td></td>
                        <td>Subordinate</td> <td>Date of Supervision</td>
                    </tr>
                        {sub}
                    </table>
                </div>

            )
        }
        else if (this.state.showFeedbackForm && this.state.feedback.length === 0){
            return(
                <div>
                    <SupervisorFeedback feedback={this.state.feedback} subordinateID={this.state.currentSubordinate} superInfo={this.props.userInfo} />
                </div>
            )
        }
        else {
            return(
                <Feedback viewUser={this.state.currentSubordinate} />
            )
        }
    }
    
}

export default Supervisor