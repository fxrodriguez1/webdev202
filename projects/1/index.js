
$(function () {
  console.log('jquery');
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap);
	}
  else {
  	initMap();
  }
});


// global vars

var circle, map, latLng, infoWindow;
var mapMarkers = [];	// array for marker objects;  helpful in removing them


// This example adds a user-editable circle to the map.
function initMap(position) {
	console.log(position);

	latLng = {lat: 41.8369, lng: -87.6847};	  // default if no geo-location data
  
  if (position.coords) {
    latLng.lat = position.coords.latitude;
    latLng.lng = position.coords.longitude;
	}


  map = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: 13
  });


  // Define a circle and set its editable property to true.
  circle = new google.maps.Circle({
    center: latLng,
    radius: 1000,
    map: map,
    editable: true,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
	});
  
  circle.addListener('bounds_changed', showNewCircle);
  
  findHouses(circle);  // make the AJAX call and map the data
  
  // Define an info window on the map;  we'll update this with new circle params
  infoWindow = new google.maps.InfoWindow();
  
}

function showNewCircle(event) {
  console.log(circle.getBounds());

  // construct circle-change info window
  var contentString = '<b>Circle Changed.</b><br>' +
      'Circle center = ' + circle.getCenter() + '<br>' +
      'Circle radius: ' + circle.getRadius();

  // Set the info window's content and position.
  infoWindow.setContent(contentString);
  infoWindow.setPosition(circle.getCenter());

  clearMarkers();   // remove existing markers 

  infoWindow.open(map);		// show the info window
  
  
  findHouses(circle);  // make the AJAX call and map the data
}



function clearMarkers () {
	// for markers in the array, remove the reference to our map object	
  $.each(mapMarkers, function(i,entry) {
  	entry.setMap(null);
  });
}



function findHouses (circle) {
	
  var apiEndpoint = 'https://data.cityofchicago.org/resource/uahe-iimk.json';
  var centerLat = circle.getCenter().lat();
  var centerLng = circle.getCenter().lng();
  
  
  // using the within_circle function and the circle's location and radius
  var filter = '?$where=within_circle(location,'
  		+ centerLat
      + ','
   		+ centerLng
      + ','     
      + circle.getRadius()
      + ')';
      
  // AJAX call
  $.get(apiEndpoint + filter)
  	.done(function (data) {
      mapInspections(data);
    })
}

function mapInspections(data){
	console.log('started mapInspections');
	$.each(data,function(i,entry) {
	    
    	var contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">' +
          entry.property_name +
          '</h1>'+
          '<div id="bodyContent">'+
          '<p>Property Type: ' +
          entry.property_type +
          '<br>' +
          entry.community_area +
          '<br>' +
          entry.address +
          '<br>' +
          '</p>'+
          '</div>'+
          '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      var marker = new google.maps.Marker({
        position: {lat: parseFloat(entry.latitude),lng: parseFloat(entry.longitude)},
        map: map,
        title: entry.property_name
      });
      
      mapMarkers.push(marker);	// add each marker to the array for later removal
      
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    });

}
