var Usuario = require('../models/usuarios');
var bcrypt = require("bcrypt");

module.exports = function(app)
{
  app.post("/login", function(req, res){
    
    var user_name = req.body.user_name;

    Usuario.existsUser(user_name,function(error, data) {
      if (data.length == 0)
        res.send({
          authorized : false, 
          msg : "Usuario no existe"
        });
      else
        Usuario.getPassword(user_name,function(error, data) {
          var hash = data[0].password.replace(/^\$2y(.+)$/i, '\$2a$1');
          bcrypt.compare(req.body.password, hash, function(err, resp) {
            
            if(resp)
              res.send({
                authorized : true, 
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