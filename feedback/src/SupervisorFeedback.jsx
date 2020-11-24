import React from 'react'
import { apiType,currentUser } from './api'
const date = new Date();

class SupervisorFeedback extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            showFeedbackForm: false,
            feedbackInput: "",
            formattedDate: `${date.getMonth()}/${date.getDate()}/${date.getYear()}`
        }
        
    }


    handleNewFeedback = () => {
        this.setState({showFeedbackForm: true})

    }

    async submitFeedback(e){
        e.preventDefault();
        
        let time = date.getTime();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: this.props.subordinateID,
                supervisorId: `${currentUser}`,
                supervisorFeedback: this.state.feedbackInput,
                date: time,
                superFirst: this.props.superInfo.firstName,
                superLast: this.props.superInfo.lastName
            })
        }
        console.log(requestOptions);
       
        let apiCall = apiType.feedbackAPI + `/newFeedback`;
        
        await fetch(apiCall, requestOptions)
            .then(response => response.json())
            
        this.setState({showFeedbackForm:false})

    }

    feedbackInputChange = (e) => {
        this.setState({feedbackInput: e.target.value})
    }

    handleCancel = () => {
        this.setState({showFeedbackForm:false})
    }

    render(){
        
            if (this.props.feedback.length > 0){
                
                // this.props.feedback.map(each => (
                //     <tr><td>
                //                         <button onClick={() => this.handleViewFeedback(each.subordinateID)} 
                //                                 className="BUTTON_UXG">Feedback</button></td>
                //                         <td>{each.firstName} {each.lastName} </td> 
                //                         <td>{each.DateOfSupervison}
                //                         </td></tr>
                // ))
            }

            return(
                <div>
                {!this.state.showFeedbackForm ? 
                    <div>
                        <button onClick={this.handleNewFeedback} className="BUTTON_UXG">New Feedback</button>
                    </div>
                    : ""}
                    {(this.props.feedback.length === 0 && !this.state.showFeedbackForm) ? "No feedback found!"  
                        : <div>{this.props.feedback.supervisorFeedback}</div> }
                    
                    {this.state.showFeedbackForm ? 
                        <div className="feedback-nav">
                            {this.state.formattedDate}
                            <form className="feedback-form" onSubmit={this.submitFeedback.bind(this)}>
                                <label id="feedback-textarea-labal">New Feedback: </label> 
                                <textarea id="feedback-textarea" onChange={this.feedbackInputChange}></textarea>
                                <input className="feedback-button" type="submit" value="Submit Feedback"  />
                            </form>
                            <button className="feedback-button" onClick={this.handleCancel} >Cancel</button> 
                        </div>
                        : ""
                    }
                </div>
            )
        }
        
}

export default SupervisorFeedback