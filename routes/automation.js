var Sensor = require('../models/sensors');
var IoT = require('../iothub');



module.exports = function(app) {
    // Light logic
    app.post("/sensors/update_light", function(req, res) {
        var lumen = req.body.lumen;
        var room = req.body.room;

        Sensor.getLightID(room, function(error, data) {
            if (data.length == 0)
                response.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                var toRaspData = {
                    action: 'update_light',
                    value: lumen,
                    id_sensor: data[0].id,
                    room: room
                };
                IoT.sendC2Dmessage(toRaspData, res);
            }
        });

    });

    app.post("/sensors/get_light", function(req, res) {
        var room = req.body.room;
        var lumen = req.body.lumen;
        var toRaspData = {
            action: 'get_light',
            room: room
        };
        IoT.sendC2Dmessage(toRaspData, res);
    });

    // Lock logic
    app.post("/sensors/update_lock", function(req, res) {
        var lock_state = req.body.lock_state;
        var room = req.body.room;
        var toRaspData = {
            action: 'update_lock',
            value: lock_state,
            room: room
        };
        IoT.sendC2Dmessage(toRaspData, res);

    });
    app.post("/sensors/get_lock", function(req, res) {
        var room = req.body.room;
        Sensor.getLockState(room, function(error, data) {
            if (data.length == 0)
                res.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                if (data[0].estado_cerradura == 1)
                    var msg = "Puerta Abierta";
                else
                    var msg = "Puerta Cerrada";

                res.send({
                    action: true,
                    lock_state: data[0].estado_cerradura,
                    msg: msg
                });
            }
        });
    });

    // Access logic
    app.post("/sensors/get_access", function(req, res) {
        var room = req.body.room;
        var toRaspData = {
            action: 'get_access',
            room: room
        };
        IoT.sendC2Dmessage(toRaspData, res);
    });
    app.post("/sensors/get_precense", function(req, res) {
        var room = req.body.room;
        var toRaspData = {
            action: 'get_precense',
            room: room
        };
        IoT.sendC2Dmessage(toRaspData, res);
    });

    // Air logic
    app.post("/sensors/update_air", function(req, res) {
        var intensity = req.body.intensity;
        var room = req.body.room;
        var toRaspData = {
            action: 'update_air',
            value: intensity,
            room: room
        };
        IoT.sendC2Dmessage(toRaspData, res);
    });
    app.post("/sensors/get_air", function(req, res) {
        var room = req.body.room;
        var toRaspData = {
            action: 'get_air',
            room: room
        };
        IoT.sendC2Dmessage(toRaspData, res);

    });
}