var mysql = require("mysql");

// First you need to create a connection to the db
var conn = mysql.createConnection({
  host: 'ptserver.southcentralus.cloudapp.azure.com',
  user: 'pt_user',
  password: 'qazwsxer',
  database: 'pt_db',
  port: 3306
});


module.exports = function(app) {

  //POST - Insert a new TVShow in the DB
  login = function(req, res) {
    console.log('POST');
  	console.log(req.body);
    var conectado = false;
    conn.connect(function(err){
      if(err){
        console.log('Error connecting to Db');
        return;
      }
      conectado = true;
      console.log('Connection established');
    });
    //login
    var json = { 'conexion' : true };
    res.contentType("application/json");
    res.send(json)
  	res.end();

  };

  //Link routes and functions
  app.post('/login', login);
  
}