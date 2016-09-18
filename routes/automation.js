var Sensor = require('../models/sensors');

module.exports = function(app)
{
  app.post("/sensors/update_light",function(req, res){
    var lumen = req.body.lumen;
    var room = req.body.room;
    
    Sensor.getLightID(room,function(error,data) {
      if (data.length == 0)
        res.send({
          action : false, 
          msg : "Cuarto incorrecto"
        });
      else{
        Sensor.updateLightLumen(data[0].id,lumen,function(error,data){});

        // Analizar estadisticas

        res.send({
          action : true, 
          msg : "Acción realizada"
        });
      }
    });
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

  app.post("/sensors/update_lock",function(req, res){
    var lumen = req.body.lumen;
    var room = req.body.room;
    
    Sensor.getLightID(room,function(error,data) {
      if (data.length == 0)
        res.send({
          action : false, 
          msg : "Cuarto incorrecto"
        });
      else{
        Sensor.updateLightLumen(data[0].id,lumen,function(error,data){});

        // Analizar estadisticas

        res.send({
          action : true, 
          msg : "Acción realizada"
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
}