var Sensor = require('../models/sensors');
var IoT = require('../iothub.js');


module.exports = function(app)
{
  // Light logic
  app.post("/sensors/update_light",function(req, res){

    var lumen = req.body.lumen;
    var room = req.body.room;

    var toRaspData = {
      action: 'update_light', 
      value: lumen,
      room: room
    };

    IoT.getRaspData(res);

    IoT.sendC2Dmessage(toRaspData);
    
  });

  app.post("/sensors/get_light",function(req, res){

    var room = req.body.room;
    Sensor.getLightLumen(room,function(error,data) {
      if (data.length == 0)
        res.send({
          action : false, 
          msg : "Cuarto incorrecto"
        });
      else{
        res.send({
          action : true, 
          lumen : data[0].lumen,
          msg : "Acción realizada"
        });
      }
    });
  });

  // Lock logic
  app.post("/sensors/update_lock",function(req, res){
    var lock_state = req.body.lock_state;
    var room = req.body.room;
    
    Sensor.getLockID(room,function(error,data) {
      if (data.length == 0)
        res.send({
          action : false, 
          msg : "Cuarto incorrecto"
        });
      else{
        Sensor.updateLockState(data[0].id,lock_state,function(error,data){});

        var toRaspData = {
          action: 'update_lock',
          value: lock_state
        };

        sendC2Dmessage(toRaspData);

        if (lock_state == 1)
          var msg = "Puerta Abierta";
        else
          var msg = "Puerta Cerrada";
        res.send({
          action : true, 
          msg : msg
        });
      }
    });
  });
  app.post("/sensors/get_lock",function(req, res){
    var room = req.body.room;
    Sensor.getLockState(room,function(error,data) {
      if (data.length == 0)
        res.send({
          action : false, 
          msg : "Cuarto incorrecto"
        });
      else{
        if(data[0].estado_cerradura == 1)
          var msg = "Puerta Abierta";
        else
          var msg = "Puerta Cerrada";

        res.send({
          action : true, 
          lock_state : data[0].estado_cerradura,
          msg : msg
        });
      }
    });
  });

  // Access logic
  app.post("/sensors/get_access",function(req, res){

    // Send C2D message looking for access info in the network

    var room = req.body.room;
    Sensor.getAccessState(room,function(error,data) {
      if (data.length == 0)
        res.send({
          action : false, 
          msg : "Cuarto incorrecto"
        });
      else{
        res.send({
          action : true, 
          states : JSON.stringify(data),
          msg : "Acción realizada"
        });
      }
    });
  });

  // Air logic
  app.post("/sensors/update_air",function(req, res){
    var intensity = req.body.intensity;
    var temperature = req.body.temperature;
    var room = req.body.room;

    // Send C2D message looking for curretn temperature
   
    Sensor.getAirID(room,function(error,data) {
      if (data.length == 0)
        res.send({
          action : false, 
          msg : "Cuarto incorrecto"
        });
      else{
        Sensor.updateAirData(data[0].id,temperature,intensity,function(error,data){});

        var toRaspData = {
          action: 'update_air',
          value: intensity
        };

        sendC2Dmessage(toRaspData);
        
        res.send({
          action : true, 
          msg : "Acción completa"
        });
      }
    });
  });
  app.post("/sensors/get_air",function(req, res){
    var room = req.body.room;
    Sensor.getAirData(room,function(error,data) {
      if (data.length == 0)
        res.send({
          action : false, 
          msg : "Cuarto incorrecto"
        });
      else{
        res.send({
          action : true, 
          temperature : data[0].temperatura,
          intensity : data[0].intensidad,
          msg : "Acción realizada"
        });
      }
    });
  });
}