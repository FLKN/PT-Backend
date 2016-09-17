var User = require('../models/users');
var bcrypt = require("bcrypt");

module.exports = function(app)
{
  app.post("/login", function(req, res){
    
    var user_name = req.body.user_name;

    User.existsUser(user_name,function(error, data) {
      if (data.length == 0)
        res.send({
          authorized : false, 
          msg : "Usuario no existe"
        });
      else
        User.getLoginInfo(user_name,function(error, data) {

          var hash = data[0].app_pass.replace(/^\$2y(.+)$/i, '\$2a$1');
          bcrypt.compare(req.body.app_pass, hash, function(err, resp) {
            
            if(resp)
              res.send({
                authorized : true,
                room :  data[0].id_habitacion,
                msg : "Accesso Autorizado"
              });
            else 
              res.send({
                authorized : false, 
                msg : "Accesso Denegado"
              });

          });
        });
    });
  });
}