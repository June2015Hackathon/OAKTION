//       returns index of winning bid
//
// node.js client to asynchronously request data from node.js server,
// which synchronousely requests data from TMforum API
// (this web page server client side cannot wait synchronously for the data)
//   for catalogManagement / productOffering
//
//
// TODO: get search string as input
//
$(function ($) {

    'use strict';

    /* connection to the node.js server's section */
    var socket = io.connect("http://127.0.0.1:4222");

    socket.emit("search","italian,food");

    // Generating this js in triggered by id=home, e.g.
    //	    <div role="tabpanel" class="tab-pane active" id="home">
    var home = document.getElementById("home");

    var tmp = "<table border=\"2\" bgcolor=\"#efefef\"><tbody><tr><th>ID</th><th>Name</th><th>Commission</th><th>Transaction</th><th>Currency</th><th>End Date</th></tr>";

    var bestItem = 0;
    var bestPrice = 0.0;
    socket.on("jsonObj", function(item) {
	for (var i = 0; i < item.length; i++) {	
	    // console.log(item[i].id);
	    // console.log(item[i].name);
	    // productOffer has to have valid start date to be compared
	    if (item[i].productOfferingPrice[0].validFor) {
		    // Does this offer has best price
		    if (parseFloat(item[i].productOfferingPrice[0].price.taxRate) > bestPrice)
		    {
			bestPrice = parseFloat(item[i].productOfferingPrice[0].price.taxRate);
			bestItem = i;
		    }
		/*
	    tmp = tmp + "<tr><th>" + item[i].id.slice(0, 4) + "</th><th>" + item[i].name;
		    tmp = tmp + "</th><th align=center>" + item[i].productOfferingPrice[0].price.taxRate;
		    tmp = tmp + "</th><th align=center>" + item[i].productOfferingPrice[0].price.dutyFreeAmount;
		    tmp = tmp + "</th><th>" + item[i].productOfferingPrice[0].price.currencyCode;
                    tmp = tmp + "</th><th>" + item[i].productOfferingPrice[0].description;
		    tmp = tmp + "</th><th>" + item[i].productOfferingPrice[0].validFor.startDateTime.slice(0, 10);
		    tmp = tmp + "</th><th>" + item[i].productOfferingPrice[0].validFor.endDateTime.slice(0, 10);
*/
	    }
	}
/*
	tmp = tmp + "</th></tr></tbody></table>";
	tmp = tmp + "<h2>Best item ID = " + bestItem + " with value of " + bestPrice + " EUR</h2>";
*/
	
	// return just id of the winner
	tmp = bestItem;
	
	// return generated web page 
	$('#home').append(tmp);

	// return only winning object
	//$('#home').append(JSON.stringify(item[bestItem]));
	// cannot do, because socket.io is needed and jquery..
	//$(function ($) {
	
	socket.close();
    });
	/* end of the connection with the node.js server's section */
});
