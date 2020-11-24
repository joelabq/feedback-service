import React from 'react'
import { apiType, currentUser } from './api'

class ViewFeedback extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            feedback: [],
            feedbackReponse: "",

        }
    }

    async componentDidMount(){

        if (this.props.feedbackId){
            let apiCall = apiType.feedbackAPI + `/feedback/${this.props.feedbackId}`;
            const response = await fetch(apiCall).then(response => response.json());
                       
            this.setState({feedback: response});
            
        }
      
    }
    
    changeFeedbackResponse = (e) => {
        this.setState({feedbackReponse: e.target.value});

    }

   async handleSubmit(e) {
        e.preventDefault();

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userid: `${currentUser}`,
                feedbackid: this.props.feedbackId,
                memberfeedback: this.state.feedbackReponse
            })
        }
        console.log(requestOptions);
       
        let apiCall = apiType.feedbackAPI + `/memberResponse`;
        let response = "";
            response = await fetch(apiCall, requestOptions)
            .then(response => response.json())
        this.props.memberSubmit();
    }
    
    render(){
        let feedbackData = this.state.feedback.map(each => (
            <form>
                <div><label>DATE:</label><span>{each.feedbackdate} </span>  </div>
                <div><label>SUPERVISOR: </label>{each.superfirstname} {each.superlastname}</div>
                <div><label>Supervsior Feedback: </label><textarea readOnly className="feedback-textarea" value={each.supervisorfeedback}></textarea></div>
                <div><label>Member Response: </label>
                {each.memberresponse ? <textarea readOnly className="feedback-textarea" value={each.memberresponse}></textarea> :
                        <textarea className="feedback-textarea" onChange={this.changeFeedbackResponse} ></textarea> }
                </div>
                <div> 
                {!each.memberresponse ? 
                
                    <><button onClick={this.handleSubmit.bind(this)}>Submit</button> <button onClick={this.props.handleClose}>Cancel</button> </> :
                
                    <><button onClick={this.props.handleClose}>Close</button></> }
                </div>
            </form>
        ))
        return(
            <div>{feedbackData}</div>
        )
        }
}

export default ViewFeedback