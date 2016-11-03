var mysql = require('mysql'),

connection = mysql.createConnection(
{ 
	host: 'us-cdbr-azure-southcentral-f.cloudapp.net',
	user: 'b77bca855ed18d',
	password: '595352af',
	database: 'pt_db',
	port: 3306
});
 
var usersModel = {};
 
usersModel.getLoginInfo = function(user_name,callback)
{
	var sql = 
	'SELECT usuarios.app_pass, usuarios.nivel, huespeds.nombre, huespeds.ap_pat, huespeds.ap_mat, huespeds.id_habitacion '+
	'FROM usuarios '+
	'INNER JOIN huespeds '+
	'ON usuarios.id=huespeds.id_usuario '+
	'WHERE usuarios.user_name =' + connection.escape(user_name);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
 
usersModel.existsUser = function(user_name,callback)
{
	var sql = 'SELECT user_name FROM usuarios WHERE EXISTS (SELECT 1 FROM usuarios WHERE user_name = ' + connection.escape(user_name) + ') ORDER BY user_name LIMIT 1';
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
module.exports = usersModel;