var express = require("express"),  
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");


app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());


app.get('/', function(req, res) {
	res.send("Hello world!");
});

routes = require('./routes/login')(app);
routes = require('./routes/automation')(app);
routes = require('./routes/room_service')(app);
routes = require('./routes/agenda')(app);

app.listen(app.get('port'), function() {  
	console.log("Node server running on http://localhost:"+app.get('port'));
});