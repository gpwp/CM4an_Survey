const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
// const fs = require('fs');
const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig)

const app = express();


app.use('/script', express.static(__dirname + '/script'));
app.use('/style', express.static(__dirname + '/style'));
app.use('/image', express.static(__dirname + '/image'));

app.use(bodyParser.urlencoded({ extended : true }));

// app.get('/', function (req, res) {
// 	res.sendFile(__dirname + '/view/main.ejs');
// });

app.all('/form/:section', function (req, res) {
	var form_num = 2;
	var section_num = req.params['section'];
	var sql = 	'SELECT * from cm_form WHERE form_idx='+ form_num + ';' + 
				'SELECT * from cm_survey WHERE t_section_idx = ' + section_num + ';' + 
				'SELECT * FROM cm_section WHERE section_idx ='+ section_num + ';' +
				'SELECT COUNT(section_idx) AS section_count FROM cm_section WHERE t_form_idx = ' + form_num + ';' +
				'SELECT COUNT(DISTINCT survey_oder) AS survey_count FROM cm_survey WHERE t_section_idx= ' + section_num; 
				
	connection.query(sql, function(error, rows){
		if (error) throw error;

		data = {
			form : rows[0],
			survey : rows[1], 
			section : rows[2],
			count : [rows[3], rows[4]]
		};

		console.log(typeof(req.body));
		console.log(req.body);
		res.render(__dirname + '/view/form/index.ejs', data);
	});
});

app.post('/submitend', function (req, res) {
	// var sql = 'INSERT INTO cm_choice(`t_section_idx`, `t_survey_idx`, `choice_number`, `choice_answer`) + VALUES (?, ?, ?, ?);';
	// var params = [];
	// connection.query(sql, params, function(err, rows){
	// 	if (error) throw error;


	// });
	console.log(req.body);
	res.render(__dirname + '/view/form/submit_info.ejs');
});


var server = app.listen(80, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Server is working : PORT - ', port);
});
