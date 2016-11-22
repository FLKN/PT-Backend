var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var EventHubClient = require('azure-event-hubs').Client;

var connectionString = 'HostName=PT-IoTHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=iRnHJOgPNG9Sq7yWbdRk3F0wYKyR2g14CWq3liG0aVs=';
var targetDevice = 'PT-raspberry_device';

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

var client = EventHubClient.fromConnectionString(connectionString);

function getRaspData(res){
  client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
      return partitionIds.map(function (partitionId) {
        return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
          console.log('Created partition receiver: ' + partitionId)
          receiver.on('errorReceived', function (err) {
              console.log(err.message);
          });
          receiver.on('message', automationMessage.bind());
        });
      });
    })
    .catch(function (err) {
      console.log(err.message);
    });
}

var automationMessage = function (message) {
  console.log('Message received: ');
  var msg = JSON.stringify(decodeURIComponent(escape(message.body)));
  var data = msg.substring(1,msg.length-1).split(",");

  var action = data[0];
  var room = data[1];
  var value = data[2];

  console.log(data);

  if (action == "get_light"){

  } else if (action == "update_light"){
    /*Sensor.getLightID(room,function(error,db_data) {
      if (db_data.length == 0)
        res.send({
            action : false, 
            msg : "Cuarto incorrecto"
        });
      else{
        Sensor.updateLightLumen(db_data[0].id,value,function(error,data){});
        res.send({
          action : true, 
          msg : "Acción realizada"
        });
      }
    });*/
  } else if (action == "get_lock"){
    
  }
}

function sendC2Dmessage(toRaspData) {
  serviceClient.open(function (err) {
    if (err) {
      console.error('IoT Hub Could not connect: ' + err.message);
    } else {
      serviceClient.getFeedbackReceiver(function(err, receiver){
       receiver.on('message', function (msg) {
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