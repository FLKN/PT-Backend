var mysql = require('mysql'),

connection = mysql.createConnection(
{ 
	host: 'ptserver.southcentralus.cloudapp.azure.com',
	user: 'pt_user',
	password: 'qazwsxer',
	database: 'pt_db',
	port: 3306
});
 
var usuariosModel = {};
 
usuariosModel.getPassword = function(user_name,callback)
{
	var sql = 'SELECT password FROM usuarios WHERE user_name = ' + connection.escape(user_name);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
 
usuariosModel.existsUser = function(user_name,callback)
{
	var sql = 'SELECT user_name FROM usuarios WHERE EXISTS (SELECT 1 FROM usuarios WHERE user_name = ' + connection.escape(user_name) + ') ORDER BY user_name LIMIT 1';
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
module.exports = usuariosModel;