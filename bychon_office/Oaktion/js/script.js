
$(function ($) {

	'use strict';
	
	/* google maps gestion */
	var marker;
	var map;

	function initializeMap(place) {
		var mapOptions = {
		  zoom: 18,
		  center: place
		}

		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		marker = new google.maps.Marker({
		    position: place,
		    title:"Hello World!"
		});

		// To add the marker to the map, call setMap();
		marker.setMap(map);
	}

	function showMap(newPlace) {
		map.setCenter(newPlace);
		marker.setPosition(newPlace);
		google.maps.event.trigger(map,'resize');
	}

	initializeMap(new google.maps.LatLng(0.0, 0.0));

	$(".list-item").each(function(index, element) {
		$(this).click(function() {
			if ($(this).attr('lat') !== typeof undefined && $(this).attr("long") !== typeof undefined) {
				showMap(new google.maps.LatLng(parseFloat($(this).attr('lat')), parseFloat($(this).attr('long'))));
			}
		});
	});

	/* End of Google Maps gestion */

	
	/* connection to the node.js server's section */
	var socket = io.connect("http://oaktion.mybluemix.net");

	socket.emit("hello");

	socket.on("disconnect", function() {
		socket.disconnect();
	});

	socket.on("new_item", function(item) {
		var tmp = $("<div class=\"container-fluid list-item\" lat=\"" + item.latitude + "\" long=\"" + item.longitude + "\">"
			+ "<img src=\"img/logo-photo.jpg\" class=\"col-md-3\">"
			+ "<div class=\"infos col-md-6\">"
			+		"<div class=\"pseudo\">" + item.pseudo + "</div>"
			+		"<div class=\"adress\">Adress</div>"
			+		"<textarea class=\"description\" readonly>" + item.desc + "</textarea>"
			+	"</div>"
			+	"<div class=\"right col-md-3\">"
			+		"<div class=\"date\">" + item.date + "</div>"
			+		"<input type=\"checkbox\" />"
			+	"</div>"
			+ "</div>");

		tmp.click(function() {
			if ($(this).attr('lat') !== typeof undefined && $(this).attr("long") !== typeof undefined) {
				showMap(new google.maps.LatLng(parseFloat($(this).attr('lat')), parseFloat($(this).attr('long'))));
			}
		});

		// var tmp2 = tmp.clone(true);

		$('#allCategory').append(tmp);
		// $("#messages").append(tmp2);
	});
	/* end of the connection with the node.js server's section */
});