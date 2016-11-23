var mysql = require('mysql'),

    connection = mysql.createConnection({
        host: 'us-cdbr-azure-southcentral-f.cloudapp.net',
        user: 'b77bca855ed18d',
        password: '595352af',
        database: 'pt_db',
        port: 3306
    });

var dishesModel = {};


dishesModel.getDishes = function(callback) {
    var sql = "SELECT * FROM platillos ORDER BY id";
    if (connection) {
        connection.query(sql, function(error, rows) {
            if (error) { throw error; } else { callback(null, rows); }
        });
    }
}

dishesModel.setOrder = function(no_dishes, total_cost, now, room, callback) {
    var data_insert = {
        costo_total: total_cost,
        cant_platillos: no_dishes,
        hora_creacion: now,
        id_habitacion: room
    };
    if (connection) {
        connection.query("INSERT INTO ordens SET ?", data_insert, function(error, rows) {
            if (error) { throw error; } else { callback(null, rows); }
        });
    }
}
dishesModel.makeOrder = function(id_order, id_dish, callback) {
    var data_insert = {
        id_orden: id_order,
        id_platillo: id_dish
    };
    if (connection) {
        connection.query("INSERT INTO orden_platillos SET ?", data_insert, function(error, rows) {
            if (error) { throw error; } else { callback(null, rows); }
        });
    }
}
module.exports = dishesModel;