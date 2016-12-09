var Event = require('../models/events');
var IoT = require('../iothub');

var distance = require('google-distance');
var moment = require("moment");

var hotel = "Av. Instituto Politécnico Nacional No. 2580, Col Barrio la Laguna Ticomán, Gustavo A. Madero, Ciudad de México";

module.exports = function(app) {
    app.post("/events/get_events", function(req, res) {
        Event.getEvents(function(error, data) {
            if (data.length == 0)
                res.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                var events = [];
                for (var i = 0; i < data.length; i++) {
                    events.push("{ id: '" + data[i].id + "'" +
                        ",nombre:'" + data[i].nombre + "'" +
                        ",ubicacion:'" + data[i].ubicacion + "'" +
                        ",descripcion:'" + data[i].descripcion + "'" +
                        //",imagen: " + data[i].imagen +
                        " }");
                }
                /*res.send({
                    action: true,
                    events: JSON.stringify(events),
                    msg: "Acción realizada"
                });*/

                var maps_aux;
                var directions = [];
                for (var i = 0; i < data.length; i++) {
                    maps_aux += data[i].ubicacion + "|";
                    directions.push(data[i].nombre);
                }


                distance.get({
                        origin: hotel,
                        destination: maps_aux,
                        language: 'es'
                    },
                    function(err, maps_data) {
                        if (err) return console.log(err);

                        var maps_durations = [];
                        for (var i = 0; i < maps_data.length; i++) {
                            maps_durations.push(parseInt(maps_data[i].duration));
                        }

                        var events = "Tiempo de recorrido partiendo del hotel" + "\n\n";

                        for (var i = 0; i < maps_durations.length; i++) {
                            events += "Hotel a " + directions[i] + " = " + maps_durations[i] + " min en auto, aprox.\n";
                        }
                        var toRaspData = {
                            action: 'events',

                            room: 1,
                            id_sensor: 0,
                            value: events
                        };
                        IoT.sendC2Dmessage(toRaspData, res);
                    });
                res.send({
                    action: true,
                    events: JSON.stringify(events),
                    msg: "Acción realizada"
                });
            }
        });
    });

}