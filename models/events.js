var mysql = require('mysql'),

connection = mysql.createConnection(
{ 
	host: 'us-cdbr-azure-southcentral-f.cloudapp.net',
	user: 'b77bca855ed18d',
	password: '595352af',
	database: 'pt_db',
	port: 3306
});
 
var eventsModel = {};
 
eventsModel.getEvents = function(callback)
{
	var sql = "SELECT * FROM eventos";
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}

eventsModel.getMatchedEvents = function(init,fin,callback)
{
	var sql = 
		"SELECT id,nombre,duracion,ubicacion FROM pt_db.eventos " +
		"WHERE hora_init >= " + connection.escape(init) + " AND " +
    	"hora_fin <= " + connection.escape(fin) + " ORDER BY duracion ASC";
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}

module.exports = eventsModel;