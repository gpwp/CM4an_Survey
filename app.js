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

app.all('/form/:form_num/:section', function (req, res) {
	var form_num = req.params['form_num'];
	var section_num = req.params['section'];
	var sql = 	'SELECT * from cm_form WHERE form_idx='+ form_num + ';' + 
				'SELECT * from cm_survey WHERE t_section_idx = ' + section_num + ';' + 
				'SELECT * FROM cm_section WHERE section_idx ='+ section_num + ';' +
				'SELECT COUNT(section_idx) AS section_count FROM cm_section WHERE t_form_idx = ' + form_num + ';' +
				'SELECT COUNT(DISTINCT survey_order) AS survey_count FROM cm_survey WHERE t_section_idx= ' + section_num; 
				
	connection.query(sql, function(error, rows){
		if (error) throw error;

		var result = [];
		result.push(req.body);		
		console.log(result);

		data = {
			form : rows[0],
			survey : rows[1], 
			section : rows[2],
			count : [rows[3], rows[4]],
			past_input : JSON.stringify(result)
		};
		


		// result.pop();		
		// console.log(result);


		// console.log(typeof(JSON.stringify(req.body)));
		// console.log(JSON.stringify(req.body));
		res.render(__dirname + '/view/form/index.ejs', data);
	});
});

app.post('/submitend', function (req, res) {

	var result = [JSON.parse(req.body.past_input)[0]];
	delete req.past_input;
	result.push(req.body);
	// console.log(result);

	
	var sql = '';
	var order = 1;
	var params = [0, 0, 0, 0];
	result.forEach(element => {
		sql = 'SELECT COUNT(DISTINCT survey_order) AS survey_count from cm_survey WHERE t_section_idx ='+ element['section_idx'];
		connection.query(sql , function(error, rows){
			// console.log( 'form_idx : ' + element['form_idx']);
			// console.log( 'section_idx : ' + element['section_idx']);
			params[0] = Number(element['form_idx']);
			params[1] = Number(element['section_idx']);

			for(var i=0; i<rows[0].survey_count; i++){
				// console.log( 'survey_order : ' + order);
				// console.log( 'choice_answer : ' + element['survey'+order]);
				params[2] = order;
				params[3] = JSON.stringify(element['survey'+order]);
				order++;
				console.log(params);

				var insert_sql = 'INSERT INTO cm_choice(`t_form_idx`, `t_section_idx`, `t_survey_order`, `choice_answer`)  VALUES (?, ?, ?, ?);';
				

				connection.query(insert_sql, params, function(error, rows){
					if (error) throw error;
					console.log("success!");
					console.log(rows);
				});
			}
		});
	});

	// var insert_sql = 'INSERT INTO cm_choice(`t_section_idx`, `t_survey_idx`, `choice_number`, `choice_answer`) + VALUES (?, ?, ?, ?);';
	// var params = [];
	// connection.query(sql, params, function(err, rows){
	// 	if (error) throw error;


	// });
	// console.log(req.body);
	// console.log(req.body['survey4']);
	res.render(__dirname + '/view/form/submit_info.ejs');
});

app.get('/admin', function(req, res) {

	res.render(__dirname + '/view/admin/index.ejs');
});

var server = app.listen(80, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Server is working : PORT - ', port);
});
