var Dish = require('../models/dishes');
var moment = require("moment");
var IoT = require('../iothub');


module.exports = function(app) {
    app.post("/dishes/get_dishes", function(req, res) {
        Dish.getDishes(function(error, data) {
            if (data.length == 0)
                res.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                var dishes = [];
                for (var i = 0; i < data.length; i++) {
                    dishes.push("{ id: '" + data[i].id + "'" +
                        ",nombre:'" + data[i].nombre + "'" +
                        ",descripcion:'" + data[i].descripcion + "'" +
                        ",precio:'" + data[i].precio + "'" +
                        //",imagen: " + data[i].imagen +
                        " }");
                }

                var dishes_rasp = "Lista de platillos disponibles\n\n";
                for (var i = 0; i < data.length; i++) {
                    dishes_rasp += "Nombre: " + data[i].nombre + " Descripcion: " + data[i].descripcion + " $" + data[i].precio + "MXN \n";
                }
                var toRaspData = {
                    action: 'dishes',
                    room: 1,
                    id_sensor: 0,
                    value: dishes_rasp
                };
                IoT.sendC2Dmessage(toRaspData, res);

                res.send({
                    action: true,
                    dishes: JSON.stringify(dishes),
                    msg: "Acción realizada"
                });
            }
        });
    });

    app.post("/dishes/set_order", function(req, res) {
        var room = req.body.room;
        var dishes_ids = req.body.dishes;
        var total_cost = req.body.total;

        dishes_ids = dishes_ids.substring(1, dishes_ids.length - 1).split(",");

        for (var i = 0; i < dishes_ids.length; i++) { dishes_ids[i] = parseInt(dishes_ids[i], 10); }

        var now = moment().add(1, 'month').format("YYYY-MM-DD H:mm:ss");

        Dish.setOrder(dishes_ids.length, total_cost, now, room, function(error, data) {

            for (var i = 0; i < dishes_ids.length; i++) {
                Dish.makeOrder(data.insertId, dishes_ids[i], function(error, data) {});
            }

            res.send({
                action: true,
                msg: "Orden Creada"
            });
        });

    });
}