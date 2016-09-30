var Dish = require('../models/dishes');
var moment = require("moment");

module.exports = function(app)
{
	app.post("/dishes/get_dishes",function(req, res){    
	    Dish.getDishes(function(error,data) {
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

	app.post("/dishes/set_order",function(req, res){
		var room = req.body.room;
		var dishes_ids = req.body.dishes;
		var total_cost = req.body.total;
		
		var array_ids = dishes_ids.split(",");
		for(var i=0; i < array_ids.length; i++) { array_ids[i] = parseInt(array_ids[i], 10); } 
		
		var now = moment().add(1,'month').format("YYYY-MM-DD H:mm:ss"); 

		Dish.setOrder(array_ids.length, total_cost, now, room, function(error, data) {
			
			for(var i=0; i < array_ids.length; i++) { 
				Dish.makeOrder(data.insertId, array_ids[i], function(error, data) { });
			} 

			res.send({
				action : true, 
				msg : "Orden Creada"
			});
		});
	});
}