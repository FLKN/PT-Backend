var Sensor = require('./models/sensors');

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var EventHubClient = require('azure-event-hubs').Client;

var connectionString = 'HostName=pt-iot.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=F+MKqg0vGBmh2d7M2cbPOYXtdMKCGC+nMfYVzmFxKfU=';
var targetDevice = 'PT-raspberry_device';

var serviceClient = Client.fromConnectionString(connectionString);

var response;

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function(partitionIds) {
        return partitionIds.map(function(partitionId) {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() }).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', function(err) {
                    console.log(err.message);
                });
                receiver.on('message', automationMessage);
            });
        });
    })
    .catch(function(err) {
        console.log(err.message);
    });

var automationMessage = function(message) {
    console.log('Message received: ');
    var msg = JSON.stringify(decodeURIComponent(escape(message.body)));
    var data = msg.substring(1, msg.length - 1).split(",");



    var action = data[0];
    var room = data[1];
    var id_sensor = data[2]
    var value = data[3];


    if (action == "get_light") {
        console.log(data);

        var lumen = parseInt(value); // 1 a 10

        /* Sensor.getLightID(room, function(error, data) {
             if (data.length == 0)
                 response.send({
                     action: false,
                     msg: "Cuarto incorrecto"
                 });
             else {
                 Sensor.updateLightLumen(data[0].id, lumen, function(error, data) {});
             }
         });

         Sensor.getLightLumen(room, function(error, data) {
             if (data.length == 0)
                 response.send({
                     action: false,
                     msg: "Cuarto incorrecto"
                 });
             else {
                 response.send({
                     action: true,
                     preset: data[0].preset,
                     lumen: data[0].lumen,
                     msg: "Acción realizada"
                 });
             }
         });*/
    } else if (action == "update_light") {
        console.log(data);
        if (value == 'a')
            var preset = 0;
        else if (value == 'b')
            var preset = 1;
        else if (value == 'c')
            var preset = 2;
        else if (value == 'd')
            var preset = 3;

        Sensor.getLightID(room, function(error, data) {
            if (data.length == 0)
                response.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                Sensor.updateLightLumen(data[0].id, preset, function(error, data) {});
                response.send({
                    action: true,
                    msg: "Acción realizada"
                });
            }
        });
    } else if (action == "update_lock") {
        console.log(data);
        var state = (value == 'g') ? 1 : 0

        Sensor.getLockID(room, function(error, data) {
            if (data.length == 0)
                response.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                Sensor.updateLockState(data[0].id, state, function(error, data) {});

                if (state == 1)
                    var msg = "Puerta Abierta";
                else
                    var msg = "Puerta Cerrada";
                response.send({
                    action: true,
                    msg: msg
                });
            }
        });
    } else if (action == "get_access") {
        console.log(data);
        /*00001 Todo cerrado 00002 Puerta abierta 00003 Ventana abierta 00004 todo abierto */
        var access = parseInt(value);
        if (value == '00001')
            var precense = 0;
        else if (value == '00002')
            var precense = 1;
        else if (value == '00003')
            var precense = 1;
        else if (value == '00004')
            var precense = 1;
        else
            var precense = 9;

        // Sensor.updateaccess();


        res.send({
            action: true,
            states: precense,
            msg: "Acción realizada"
        });
    } else if (action == "get_precense") {
        console.log(data);
    } else if (action == "get_air") {
        console.log(data);

        var temperature = parseFloat(value);

        Sensor.getAirID(room, function(error, data) {
            if (data.length == 0)
                res.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                Sensor.updateAirTempData(data[0].id, temperature, function(error, data) {});

                res.send({
                    action: true,
                    msg: "Acción completa"
                });
            }
        });

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

    } else if (action == "update_air") {
        console.log(value);
        if (value == 'k')
            var intense = 0;
        else if (value == 'l')
            var intense = 1;
        else if (value == 'm')
            var intense = 2;
        else
            var intense = 9;

        Sensor.getAirID(room, function(error, data) {
            if (data.length == 0)
                response.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                Sensor.updateAirData(data[0].id, intense, function(error, data) {});

                response.send({
                    action: true,
                    msg: "Acción completa"
                });
            }
        });
    } else if (action == "timer") {
        var statics = value.split(",");
        var time = statics[0];
        var energy = statics[1] * 46;
        Sensor.updateStatics(id_sensor, time, energy, function(error, data) {});
    }


}

module.exports = {

    sendC2Dmessage: function(toRaspData, res) {
        response = res;
        serviceClient.open(function(err) {
            if (err) {
                console.error('IoT Hub Could not connect: ' + err.message);
            } else {
                serviceClient.getFeedbackReceiver(function(err, receiver) {
                    receiver.on('message', function(msg) {
                        console.log('Feedback message:')
                        console.log(msg.getData().toString('utf-8'));
                    });
                });
                var message = new Message(JSON.stringify(toRaspData));
                message.ack = 'full';
                message.messageId = "My Message ID";
                console.log('Sending message: ' + message.getData());
                serviceClient.send(targetDevice, message, printResultFor('send'));
            }
        });
    }

}