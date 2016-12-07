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
        IoT.sendC2Dmessage(toRaspData, res);
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
        var toRaspData = {
            action: 'get_lock',
            room: room
        };
        IoT.sendC2Dmessage(toRaspData, res);
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