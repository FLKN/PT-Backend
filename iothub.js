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
    var value = data[2];

    if (action == "get_light") {
        console.log(data);
        /*response.send({
            action: false,
            msg: "Cuarto incorrecto"
        });*/
        /*Sensor.getLightID(room, function(error, data) {
            if (data.length == 0)
                response.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                Sensor.updateLightLumen(data[0].id, value, function(error, data) {});
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
        /*Sensor.getLightID(room, function(error, data) {
            if (data.length == 0)
                response.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                Sensor.updateLightLumen(data[0].id, value, function(error, data) {});
                response.send({
                    action: true,
                    msg: "Acción realizada"
                });
            }
        });*/
        console.log(data);
    } else if (action == "get_lock") {
        /*Sensor.getLockState(room, function(error, data) {
            if (data.length == 0)
                response.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                if (data[0].estado_cerradura == 1)
                    var msg = "Puerta Abierta";
                else
                    var msg = "Puerta Cerrada";

                response.send({
                    action: true,
                    lock_state: data[0].estado_cerradura,
                    msg: msg
                });
            }
        });*/
    } else if (action == "update_lock") {
        Sensor.getLockID(room, function(error, data) {
            if (data.length == 0)
                response.send({
                    action: false,
                    msg: "Cuarto incorrecto"
                });
            else {
                Sensor.updateLockState(data[0].id, lock_state, function(error, data) {});

                if (lock_state == 1)
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

    } else if (action == "get_air") {

    } else if (action == "update_air") {

    }


}

module.exports = {

    sendC2Dmessage: function(type, toRaspData, res) {
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
                if (type == 2) {
                    res.send({
                        action: true,
                        msg: "Acción realizada"
                    });
                }
            }
        });
    }

}