var Sensor = require('../models/sensors');
var IoT = require('../iothub');



module.exports = function(app) {
    // Light logic
    app.post("/sensors/update_light", function(req, res) {
        var lumen = req.body.lumen;
        var room = req.body.room;
        var toRaspData = {
            action: 'update_light',
            value: lumen,
            room: room
        };
        IoT.sendC2Dmessage(1, toRaspData, res);
    });

    app.post("/sensors/get_light", function(req, res) {
        var room = req.body.room;
        var toRaspData = {
            action: 'get_light',
            room: room
        };
        IoT.sendC2Dmessage(1, toRaspData, res);
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
        IoT.sendC2Dmessage(1, toRaspData, res);

    });
    app.post("/sensors/get_lock", function(req, res) {
        var room = req.body.room;
        var toRaspData = {
            action: 'get_lock',
            room: room
        };
        IoT.sendC2Dmessage(1, toRaspData, res);
    });

    // Access logic
    app.post("/sensors/get_access", function(req, res) {
        var room = req.body.room;
        var toRaspData = {
            action: 'get_access',
            room: room
        };
        IoT.sendC2Dmessage(1, toRaspData, res);


        Sensor.getAccessState(room, function(error, data) {
            if (data.length == 0)
                res.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                res.send({
                    action: true,
                    states: JSON.stringify(data),
                    msg: "Acción realizada"
                });
            }
        });
    });

    // Air logic
    app.post("/sensors/update_air", function(req, res) {
        var intensity = req.body.intensity;
        var temperature = req.body.temperature;
        var room = req.body.room;
        var toRaspData = {
            action: 'get_light',
            room: room
        };
        IoT.sendC2Dmessage(1, toRaspData, res);

        // Send C2D message looking for curretn temperature

        Sensor.getAirID(room, function(error, data) {
            if (data.length == 0)
                res.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                Sensor.updateAirData(data[0].id, temperature, intensity, function(error, data) {});

                var toRaspData = {
                    action: 'update_air',
                    value: intensity
                };

                sendC2Dmessage(toRaspData);

                res.send({
                    action: true,
                    msg: "Acción completa"
                });
            }
        });
    });
    app.post("/sensors/get_air", function(req, res) {
        var room = req.body.room;
        Sensor.getAirData(room, function(error, data) {
            if (data.length == 0)
                res.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                res.send({
                    action: true,
                    temperature: data[0].temperatura,
                    intensity: data[0].intensidad,
                    msg: "Acción realizada"
                });
            }
        });
    });
}