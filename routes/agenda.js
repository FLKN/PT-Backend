var Event = require('../models/events');
var distance = require('google-distance');
var moment = require("moment");

module.exports = function(app)
{
	app.post("/events/get_events",function(req, res){    
	    Event.getEvents(function(error,data) {
	      	if (data.length == 0)
	        	res.send({
	          	action : false, 
	          	msg : "Cuarto incorrecto"
        	});
	      	else{
				res.send({
					action : true, 
					dishes : JSON.stringify(data),
					msg : "Acción realizada"
				});
			}
		});
	});

	app.post("/events/set_agenda",function(req, res){    
		var room = req.body.room;
		var init = req.body.init;
		var finish = req.body.finish;
		var hotel = "Av. Instituto Politécnico Nacional No. 2580, Col Barrio la Laguna Ticomán, Gustavo A. Madero, Ciudad de México";

		var t_limit = difHours(init,finish);

		Event.getMatchedEvents(init,finish,function(error,db_data) {
        	var maps_aux;
        	var db_durations = [];
        	for(var i = 0; i < db_data.length; i++) {
        		maps_aux += db_data[i].ubicacion + "|";
        		db_durations.push(db_data[i].duracion);
        	}

        	distance.get(
            {
                origin: hotel,
                destination: maps_aux,
                language: 'es'
            },
            function(err, maps_data) {
                if (err) return console.log(err);

                var maps_durations = [];
                for(var i = 0; i < maps_data.length; i++) {
                	maps_durations.push(parseInt(maps_data[i].duration));
	        	}
	        	maps_durations.sort(function(a,b) { return a - b; });
	       	
            });
		});
    });

    function difHours(init,finish) {

		initMin = parseInt(init.substr(3,2));
		initHr = parseInt(init.substr(0,2));

		finishMin = parseInt(finish.substr(3,2));
		finishHr = parseInt(finish.substr(0,2));

		lapsedMin = finishMin - initMin;
		lapsedHr = finishHr - initHr;

		if (lapsedMin < 0) {
			lapsedHr--;
			lapsedMin = 60 + lapsedMin;
		}

		hr = lapsedHr.toString();
		min = lapsedMin.toString();

		if (hr.length < 2) {
			hr = "0"+hr;
		}

		if (hr.length < 2) {
			hr = "0"+hr;
		}

		min = min + (hr*60);

		return min;
	}
}