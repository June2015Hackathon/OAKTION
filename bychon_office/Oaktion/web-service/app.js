console.log("#############################");

var http = require('http');

var server = {
	port : process.env.PORT
};

function Item(idx, pseudo, desc, date, category, latitude, longitude, img) {
	this.idx = idx,
	this.pseudo = pseudo,
	this.desc = desc,
	this.date = date,
	this.category = category,
	this.latitude = latitude,
	this.longitude = longitude,
	this.img = img
}

Item.prototype.getInfo = function() {
	return {
		pseudo : this.pseudo,
		desc : this.desc,
		date : this.date,
		category : this.category,
		latitude : this.latitude,
		longitude : this.longitude,
		img : this.img
	};
}

var items = [];

httpServer = http.createServer(function(req, res){
	res.writeHead(200);
	res.end("Webservice for the awesome group Oaktion !");
});


httpServer.listen(server.port);

httpServer.on("error", function(err) {
	if (err.code == "EADDRINUSE") {
		console.log("\033[31mAddress already in use, retrying...\033[0m");
		setTimeout(function() {
			httpServer.close();
			httpServer.listen(server.port);
		}, 1000);
	}
});

var io = require("socket.io").listen(httpServer, {origins:"*:*"});

io.sockets.on("error", function(err) {
	console.log("\033[31m" + err + "\033[0m");
});

io.sockets.on("connection", function(socket) {

	/* if an error occurs */
	socket.on("error", function(err) {
		console.log("\033[31m" + err + "\033[0m");
	});

	console.log("A new user join us");

	for (var i = 0; i < items.length; i++) {
		socket.emit("new_item", items[i]);
	}
});

/**********************/

var options = {
	host : 'env-0693795.jelastic.servint.net',
	path : '/DSTroubleTicket/api/troubleTicketManagement/v2/troubleTicket/?type=oaktion',
	headers : {
		'User-Agent' : 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36',
		'Content-Type' : 'application/json',
		'Accept' : 'application/json',
	}
};

function itemsContainsObject(id) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].idx == id) {
            return true;
        }
    }
    return false;
}

callback = function(response) {
	var str = '';

	response.on('data', function(chunk) {
		str += chunk;
	});

	response.on('end', function() {
		var jsonObj = JSON.parse(str);
		if (jsonObj.constructor === [].constructor) {
			for (var i = 0; i < jsonObj.length; i++) {	
				var relatedObj = jsonObj[i].relatedObject;
				if (itemsContainsObject(jsonObj[i].id) == false) {
					var obj = new Item();
					obj.idx = jsonObj[i].id;
					for (var j = 0; j < relatedObj.length; j++) {
						if (relatedObj[j].involvement == "pseudo")
							obj.pseudo = relatedObj[j].reference;
						else if (relatedObj[j].involvement == "description")
							obj.desc = relatedObj[j].reference;
						else if (relatedObj[j].involvement == "date")
							obj.date = relatedObj[j].reference;
						else if (relatedObj[j].involvement == "category")
							obj.category = relatedObj[j].reference;
						else if (relatedObj[j].involvement == "latitude")
							obj.latitude = relatedObj[j].reference;
						else if (relatedObj[j].involvement == "longitude")
							obj.longitude = relatedObj[j].reference;
						else if (relatedObj[j].involvement == "picture")
							obj.img = relatedObj[j].reference;
					}
					items.push(obj);
					io.emit("new_item", obj);
				}
			}
		}
		else if (jsonObj.constructor === {}.constructor) {
			var relatedObj = jsonObj.relatedObject;
			if (itemsContainsObject(jsonObj.id) == false) {
				var obj = new Item();
				obj.idx = jsonObj.id;
				for (var j = 0; j < relatedObj.length; j++) {
					if (relatedObj[j].involvement == "pseudo")
						obj.pseudo = relatedObj[j].reference;
					else if (relatedObj[j].involvement == "description")
						obj.desc = relatedObj[j].reference;
					else if (relatedObj[j].involvement == "date")
						obj.date = relatedObj[j].reference;
					else if (relatedObj[j].involvement == "category")
						obj.category = relatedObj[j].reference;
					else if (relatedObj[j].involvement == "latitude")
						obj.latitude = relatedObj[j].reference;
					else if (relatedObj[j].involvement == "longitude")
						obj.longitude = relatedObj[j].reference;
					else if (relatedObj[j].involvement == "picture")
						obj.img = relatedObj[j].reference;
				}
				items.push(obj);
				io.emit("new_item", obj);
			}
		}
	});
}

setInterval(function() {
	http.request(options, callback).end();
}, 1000);