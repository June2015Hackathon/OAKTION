// Return transaction offers that have been sent to users,
// so we can bill the local businesses for our advertising services.
// also calculates sum.
//
// node.js client to asynchronously request data from node.js server,
// which synchronousely requests data from TMforum API
// (this web page server client side cannot wait synchronously for the data)
//   for catalogManagement / productOffering
//
$(function ($) {

    'use strict';

    /* connection to the node.js server's section */
    var socket = io.connect("http://127.0.0.1:4233");

    socket.emit("hello");

    // Generating this js in triggered by id=home, e.g.
    //	    <div role="tabpanel" class="tab-pane active" id="home">
    var home = document.getElementById("home");

    var tmp = "<table border=\"2\" bgcolor=\"#efefef\"><tbody><tr><th>ID</th><th>Name</th><th>Commission</th><th>Transaction</th><th>Currency</th><th>End Date</th></tr>";

    var sumtotal = 0.0;
    socket.on("jsonObj", function(item) {
	for (var i = 0; i < item.length; i++) {	
	    // console.log(item[i].id);
	    // console.log(item[i].name);
	    // Check if the productOffering item has been delivered and if not, skip it
	    if (item[i].productOfferingPrice[0].validFor) {
	    tmp = tmp + "<tr><th>" + item[i].id.slice(0, 4) + "</th><th>" + item[i].name;
		    tmp = tmp + "</th><th align=center>" + item[i].productOfferingPrice[0].price.taxRate;
		    tmp = tmp + "</th><th align=center>" + item[i].productOfferingPrice[0].price.dutyFreeAmount;
		    tmp = tmp + "</th><th>" + item[i].productOfferingPrice[0].price.currencyCode;
                    tmp = tmp + "</th><th>" + item[i].productOfferingPrice[0].description;
	            tmp = tmp + "</th><th>" + item[i].productOfferingPrice[0].validFor.startDateTime.slice(0, 10);
	            tmp = tmp + "</th><th>" + item[i].productOfferingPrice[0].validFor.endDateTime.slice(0, 10);
		    sumtotal = sumtotal +  parseFloat(item[i].productOfferingPrice[0].price.taxRate);
	    }
	}

	tmp = tmp + "</th></tr></tbody></table>";
	tmp = tmp + "<h2>Total commissions to charge = " + sumtotal + " EUR</h2>";
	
	$('#home').append(tmp);
	socket.close();
    });
	/* end of the connection with the node.js server's section */
});
