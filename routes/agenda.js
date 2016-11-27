var Event = require('../models/events');
var IoT = require('../iothub.js');

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
                var maps_aux;
                var directions = [];
                for (var i = 0; i < data.length; i++) {
                    maps_aux += data[i].ubicacion + "|";
                    directions.push(data[i].ubicacion);
                }


                distance.get({
                        origin: hotel,
                        destination: maps_aux,
                        language: 'es'
                    },
                    function(err, maps_data) {
                        if (err) return console.log(err);
                        console.log(maps_data);
                        /*
						var maps_durations = [];
						for(var i = 0; i < maps_data.length; i++) {
							maps_durations.push(parseInt(maps_data[i].duration));
						}
						maps_durations.sort(function(a,b) { return a - b; });
						*/
                        res.send({
                            action: true,
                            //dishes : JSON.parse(maps_durations),
                            dishes: "JSON.parse(maps_durations)",
                            msg: "Acción realizada"
                        });
                    });
            }
        });
    });
}