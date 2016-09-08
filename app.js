var express = require("express"),  
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());


app.get('/', function(req, res) {
  res.send("Hello world!");
});

routes = require('./routes/login')(app);


app.listen(9090, function() {  
  console.log("Node server running on http://localhost:9090");
});