let mysql = require('mysql');

let connection = mysql.createConnection({
  debug: false,
  host: '',
	port: ,
	user: '',
	password:'',
	database: ''
});

module.exports = connection;
