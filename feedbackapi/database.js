const currentUser = require('./api')


const Pool = require('pg').Pool
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'proj1_feedback',
    password: 'admin', 
    port: 5432
});


const getFeedbackSummary = (req,res) => {
    let userId = req.params.id;
    pool.query("SELECT feedbackid,TO_CHAR(feedbackdate, 'Mon DD YYYY') as feedbackdate, (CASE WHEN memberresponse IS NULL THEN 0  ELSE 1 END) as membercompleted,firstname as superfirstname,lastname as superlastname FROM feedbacktbl RIGHT JOIN supervisortbl ON  feedbacktbl.supervisorid = supervisortbl.supervisorid WHERE userid = $1 ORDER BY feedbackdate DESC", [userId], (err, result) => {
            if(err) {
                throw err;
            }
            
            res.status(200).send(result.rows);
        })
}

const supervisorySummery = (req,res) => {
    let userId = req.params.id;
    pool.query("SELECT feedbackid,TO_CHAR(feedbackdate, 'Mon DD YYYY') as feedbackdate, TO_CHAR(feedbackdate + INTERVAL '60 day', 'Mon DD YYYY') as duedate, (CASE WHEN memberresponse IS NULL THEN 0  ELSE 1 END) as membercompleted,firstname as superfirstname,lastname as superlastname FROM feedbacktbl RIGHT JOIN supervisortbl ON  feedbacktbl.supervisorid = supervisortbl.supervisorid WHERE userid = $1 limit 1;", [userId], (err, result) => {
            if(err) {
                throw err;
            }
            
            res.status(200).send(result.rows);
        })
}

const newFeedback = (req,res) => { 
    
    let feedback = req.body;
    let currentDate = Math.floor(new Date().getTime() / 1000); //Unix epoch in seconds rounded down
 console.log("request: ",feedback);

    // console.log(`${feedback.userId},${feedback.supervisorId},${feedback.supervisorFeedback},${currentDate}`)
    //if (apiCallFunction(session.supervisorId,feedback.userId) {} //append below. Need API call setup to verify supervisor matches subordinate
    pool.query("SELECT * from supervisortbl where supervisorid = $1", [feedback.supervisorId], (err, result) => {
        if(err) {
            
            throw err;
        }
        console.log("rows: ", result.rows);
        
        if (result.rows.length === 0){
            console.log("insert super");
            pool.query("INSERT INTO supervisortbl (supervisorid,firstname,lastname) VALUES ($1,$2,$3) ", [feedback.supervisorId,feedback.superFirst,feedback.superLast], (err, result) => {
                if(err) {
                    throw err;
                }
            }
            )}
    })


    if (feedback.userId && feedback.supervisorId && feedback.supervisorFeedback){
        pool.query("INSERT INTO feedbacktbl (userid,supervisorid,supervisorfeedback,feedbackdate) VALUES ($1,$2,$3,to_timestamp($4))", [feedback.userId,feedback.supervisorId,feedback.supervisorFeedback,currentDate], (err, result) => {
            if(err) {
                throw err;
            } 
            res.status(200).send({"message": "Success!"});
        })
    }
    else {
        res.status(400).send({Error: "Failed"});
    }
} 
const memberResponse = (req,res) => { 
    let feedbackResponse = req.body;
    console.log("UPDATE feedbacktbl SET memberresponse = $1 where userid = $2 and feedbackId = $3", [feedbackResponse.memberfeedback,feedbackResponse.userid,feedbackResponse.feedbackid])
    if (feedbackResponse.userid && feedbackResponse.memberfeedback){
        pool.query("UPDATE feedbacktbl SET memberresponse = $1 where userid = $2 and feedbackId = $3", [feedbackResponse.memberfeedback,feedbackResponse.userid,feedbackResponse.feedbackid], (err, result) => {
            if(err) {
                throw err;
            } 
            console.log(result.status);
            res.status(200).send({"message": "Success!"});
        })
    }
    else {
        
        res.status(400).send({Error: "Failed"});
    }
}


const getSuperInfo = (req,res) => {
    let supervisorId = req.params.supervisorId;
    pool.query("SELECT * FROM supervisorTbl WHERE supervisorId = $1", [supervisorId], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).send(result.rows);
    })
}

const getFeedback = (req,res) => {
    let feedbackId = req.params.feedbackId;
    if (feedbackId) {
        pool.query("select TO_CHAR(feedbackdate, 'Mon DD YYYY') as feedbackdate, supervisorfeedback, memberresponse,firstname as superfirstname,lastname as superlastname FROM feedbacktbl RIGHT JOIN supervisortbl ON  feedbacktbl.supervisorid = supervisortbl.supervisorid WHERE feedbackid = $1", [feedbackId], (err, result) => {
            if(err) {
                throw err;
            }
            res.status(200).send(result.rows);
        })
}   
} 

const getFeedbackByUser = (req,res) => {
    let userId = req.params.userId;
    pool.query("SELECT * FROM feedbacktbl WHERE userid = $1", [userId], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).send(result.rows);
    })
}

module.exports = {
    getFeedbackSummary,
    getSuperInfo,
    newFeedback,
    getFeedback,
    getFeedbackByUser,
    memberResponse,
    supervisorySummery,
}