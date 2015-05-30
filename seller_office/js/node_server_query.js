//
// node.js server to request data from TMforum API
// (as web page server client side cannot wait synchronously for the data)
//   for catalogManagement / productOffering
//
// Bug: once data is got from the API it is not refreshed after that!
//
//
// Install socket.io by:
//   npm install socket.io

var http = require('http');

// Store the received and parsed json object data here for reply
var jsonObj;

// Store the search string
var searchStr;

var server = {
	port : 4222
};

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

var io = require("socket.io").listen(httpServer);

io.sockets.on("error", function(err) {
	console.log("\033[31m" + err + "\033[0m");
});

io.sockets.on("connection", function(socket) {

    /* if an error occurs */
    socket.on("error", function(err) {
	console.log("\033[31m" + err + "\033[0m");
    });

    /* search param not passed, temporarily force statis string */
    searchStr = 'initial';
    socket.on("search", function(searchparam) {
	searchStr = searchparam;
	console.log("received", searchparam);
    });

//	console.log("A new user join us");

    // send whole the data to server
    socket.emit("jsonObj", jsonObj);

    /* Debug. Inject test data instead of sending the real data
	socket.emit("new_item", {
		pseudo : "Bychon",
		desc : "My point of view...",
		date : "now"
	});
   */
});


/**********************/
// adding "?type=oaktion" to the end of path will filter out console.log prints..

var options = {
	host : 'env-0693795.jelastic.servint.net',
//	path : '/DSProductCatalog/api/catalogManagement/v2/productOffering?type=oaktion',
//    path : '/DSProductCatalog/api/catalogManagement/v2/productOffering',
	path : '/DSProductCatalog/api/catalogManagement/v2/productOffering?category.name=italian,food',
//        path : '/DSProductCatalog/api/catalogManagement/v2/productOffering?category.name=' + searchStr,
//	host : 'env-0693795.jelastic.servint.net',
//	path : '/DSTroubleTicket/api/troubleTicketManagement/v2/troubleTicket?type=oaktion',
	headers : {
		'User-Agent' : 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36',
		'Content-Type' : 'application/json',
		'Accept' : 'application/json',
	}
};

callback = function(response) {
	var str = '';

    console.log("mystring" + searchStr);
    console.log("response" + response.statusCode);

    /* search param not passed, temporarily force statis string */
//    searchStr = 'italian,food';
    
    options.path= '/DSProductCatalog/api/catalogManagement/v2/productOffering?category.name=' + searchStr;
    console.log(options.path);

    // TMforum API has data in JSON format, join chunks and parse JSON
    response.on('data', function(chunk) {
	str += chunk;
    });

    response.on('end', function() {
	jsonObj = JSON.parse(str);

	// Optional debug print of data from real API
/*
	for (var i = 0; i < jsonObj.length; i++) {	
	    console.log(jsonObj[i].id);
	    console.log(jsonObj[i].name);
	}
*/	    
    });
}

http.request(options, callback).end();
