var mysql = require('mysql'),

connection = mysql.createConnection(
{ 
	host: 'ptserver.southcentralus.cloudapp.azure.com',
	user: 'pt_user',
	password: 'qazwsxer',
	database: 'pt_db',
	port: 3306
});
 
var sensorsModel = {};
//Modelos para Luces
sensorsModel.updateLightState = function(state,room,callback)
{
	var sql = "UPDATE sensors SET estado = "+ connection.escape(state) +" WHERE id_habitacion = " + connection.escape(room);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
sensorsModel.updateLightLumen = function(id,lumen,callback)
{
	var sql = "UPDATE sensor_luzs SET lumen = "+ connection.escape(lumen) +" WHERE id_sensor = " + connection.escape(id);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
sensorsModel.getLightID = function(room,callback)
{
	var sql = "SELECT id FROM sensors WHERE id_habitacion = " + connection.escape(room);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
sensorsModel.getLightLumen = function(room,callback)
{
	var sql = 
		"SELECT sensor_luzs.lumen " +
		"FROM sensor_luzs " +
		"INNER JOIN sensors " +
		"ON sensors.id = sensor_luzs.id_sensor " +
		"WHERE sensors.id_habitacion = " + connection.escape(room);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}

//Modelos para Cerradura
sensorsModel.getLockState = function(room,callback)
{
	var sql = 
		"SELECT sensor_cerraduras.estado_cerradura " +
		"FROM sensor_cerraduras " +
		"INNER JOIN sensors " +
		"ON sensors.id = sensor_cerraduras.id_sensor " +
		"WHERE sensors.id_habitacion = " + connection.escape(room);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}

	
 

module.exports = sensorsModel;