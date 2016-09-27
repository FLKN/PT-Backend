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
	var sql = 
		"SELECT sensors.id " +
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
sensorsModel.getLockID = function(room,callback)
{
	var sql = 
		"SELECT sensors.id " +
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
sensorsModel.updateLockState = function(id,lock_state,callback)
{
	var sql = "UPDATE sensor_cerraduras SET estado_cerradura = "+ connection.escape(lock_state) +" WHERE id_sensor = " + connection.escape(id);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}

//Modelos para Acceso
sensorsModel.getAccessState = function(room,callback)
{
	var sql = 
		"SELECT sensor_accesos.estado_magnetico " +
		"FROM sensor_accesos " +
		"INNER JOIN sensors " +
		"ON sensors.id = sensor_accesos.id_sensor " +
		"WHERE sensors.id_habitacion = " + connection.escape(room);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
sensorsModel.getAccessID = function(room,callback)
{
	var sql = 
		"SELECT sensors.id " +
		"FROM sensor_accesos " +
		"INNER JOIN sensors " +
		"ON sensors.id = sensor_accesos.id_sensor " +
		"WHERE sensors.id_habitacion = " + connection.escape(room);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
sensorsModel.updateAccessState = function(id,accsess_state,callback)
{
	var sql = "UPDATE sensor_accesos SET estado_magnetico = "+ connection.escape(lock_state) +" WHERE id_sensor = " + connection.escape(id);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
 
//Modelos para Ventilacion
sensorsModel.getAirData = function(room,callback)
{
	var sql = 
		"SELECT sensor_ventilacions.temperatura, sensor_ventilacions.intensidad " +
		"FROM sensor_ventilacions " +
		"INNER JOIN sensors " +
		"ON sensors.id = sensor_ventilacions.id_sensor " +
		"WHERE sensors.id_habitacion = " + connection.escape(room);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
sensorsModel.getAirID = function(room,callback)
{
	var sql = 
		"SELECT sensors.id " +
		"FROM sensor_ventilacions " +
		"INNER JOIN sensors " +
		"ON sensors.id = sensor_ventilacions.id_sensor " +
		"WHERE sensors.id_habitacion = " + connection.escape(room);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}
sensorsModel.updateAirData = function(id,temperature,intensity,callback)
{
	var sql = 
		"UPDATE sensor_ventilacions " +
		"SET temperatura = "+  connection.escape(temperature) + ", " +
		"intensidad = "+  connection.escape(intensity) +
		" WHERE id_sensor = " + connection.escape(id);
	if (connection) {
		connection.query(sql, function(error, rows) {
			if(error) { throw error; }
			else { callback(null, rows); }
		});
	}
}

module.exports = sensorsModel;