import React from 'react'
import { apiType, currentUser } from './api'
import ViewFeedback from './ViewFeedback'

class Feedback extends React.Component{
    constructor(props){
        super(props);
        this.state = {

            feedback: [],
            viewFeedbackId: 0,
        }
    }
    async componentDidMount(){

        let apiCall = apiType.feedbackAPI + `/feedbackSummary/${this.props.viewUser}`;
        const response = await fetch(apiCall).then(response => response.json());
        this.setState({feedback: response});
      
    }

    handleViewFeedback = (feedbackid) => {
        this.setState({viewFeedbackId: feedbackid});
    }

    async handleMemberSubmit(e){
        
        this.setState({viewFeedbackId: 0});

        let apiCall = apiType.feedbackAPI + `/feedbackSummary/${currentUser}`;
        const response = await fetch(apiCall).then(response => response.json());
        this.setState({feedback: response});

        
    }

    handleClose = (e) => {
        
        e.preventDefault();
        this.setState({viewFeedbackId: 0});
        

    }
   
    render(){
           let myFeedback = this.state.feedback.map( each => ( 
                <div className="feedback-row">
                    <div className="feedback-item-row"><button onClick={() => this.handleViewFeedback(each.feedbackid)}>View</button>
                        <span className="feedback-field-item"><b>DATE: </b>{ each.feedbackdate } </span>
                        <span className="feedback-field-item"><b>SUPERVISOR:</b> {each.superfirstname} {each.superlastname} </span>
                        <span className="feedback-field-item"><b>STATUS: </b> </span>
                            {!each.membercompleted ? <span className="feedback-field-item">Not completed</span> 
                                : <span className="feedback-field-item">Completed</span>} 
                    </div>
                </div>))
                if (myFeedback.length === 0) { myFeedback = "No Feedback Found!"}
        return(
            <> 
                {!this.state.viewFeedbackId ? myFeedback : <ViewFeedback feedbackId={this.state.viewFeedbackId} 
                    memberSubmit={this.handleMemberSubmit.bind(this)} handleClose={this.handleClose} />}
                
            </>
        )
        }
}

export default Feedback

