const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database:'fvi_quiz_app'
});
    connection.connect();
    app.use(bodyParser.json());

app.get('/allquestions', function(req, res){
    connection.query("SELECT * FROM medical_questions",
    function(err, rows){
        if(err){
            return res.status(500).json({database_error:err});
        }
        res.json(rows)
    });
});

app.post('/createquestion', function(req, res){
    var newQuestionText = req.body.questionText;
    console.log(req.body);
    connection.query(`INSERT INTO medical_questions (question) values ('${newQuestionText}')`,
    function(err, result){
        if(err){
            res.status(500).json({db_error: err});
            return;
        }
        console.log("inserted: "+JSON.stringify(result));
        var values = "";
        for (var i = 0; i < req.body.answers.length; i++){
            values += "("+ result.insertId+", '" +
                    req.body.answers[i].answerText + "', " +
                    req.body.answers[i].correct +"),"

        }
        values = values.substring(0, values.length-1);
        connection.query(`INSERT INTO medical_question_answers
        (question_id, answer_text, correct)
        VALUES`+ values, function(err2, result2){
            if(err2){
                res.status(500).json({db_error: err2});
                return;
            }
            res.json({result1: result, result2: result2});
        }

        )
    })
});

app.listen(1400, function(){
    console.log("Server listening...");
});
