import React from 'react'


class FeedbackForm extends React.Component{
    constructor(props){
        super(props);
    }
    
    handleChangeFeedback = (e) => {
        this.setState({newFeedback: e.target.value})
    }

    submitFeedback = (e) => {
        e.preventDefault();
        this.props.passFormData(this.state.newFeedback);
        
    }
    
    render(){
        return(
            <div className="feedback-nav">
                <form className="feedback-form" onSubmit={this.submitFeedback}>
                    <label id="feedback-textarea-labal" >New Feedback: </label> <textarea className="feedback-textarea" onChange={this.handleChangeFeedback}></textarea>
                    <input className="feedback-button" type="submit" value="Submit Feedback"  />
                </form>
                <button className="feedback-button" onClick={this.props.handleCancel} >Cancel</button> 
                
            </div>
        )
    }
}


export default FeedbackForm