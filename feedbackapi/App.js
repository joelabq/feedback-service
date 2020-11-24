const express = require('express');
const app = express();
const port = 3001;
const session = require('client-sessions');
const db = require("./database");


const bodyParser = require("body-parser")
app.use(bodyParser.json());

app.get('/feedbackSummary/:id', db.getFeedbackSummary);

app.post('/newFeedback', db.newFeedback);

app.post('/memberResponse', db.memberResponse);

app.get('/supervisor/:supervisorId', db.getSuperInfo);

app.get('/feedback/:feedbackId', db.getFeedback);

app.get('/usersFeedback/:userId', db.getFeedbackByUser);

app.listen(port, () => console.log(`...listening at http://localhost:${port}`))