'use strict';

var mapModule = (function() {
    var map;
    var infowindow;
    var bounds;
    var sortedResults = [];

    var init = function () {
        var philly = { lat: 39.9526, lng: -75.1652 };
        var mapElement = document.getElementById('map');
        var mapOptions = {
            center: philly,
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}]
        };
        map = new google.maps.Map(mapElement, mapOptions);
        infowindow = new google.maps.InfoWindow();
        bounds = new google.maps.LatLngBounds();
        var service = new google.maps.places.PlacesService(map);
        var request = {
            location: philly,
            keyword: 'Cheesesteak',
            radius: 10000,
        }

        service.nearbySearch(request, nearbySearchCallback);
    };

    var nearbySearchCallback = function(results, status) {
        sortedResults = _.sortBy(results, ['rating']).reverse();
        console.log(sortedResults);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < sortedResults.length; i++) {
                createMarker(sortedResults[i]);
                createListItem(sortedResults[i]);
            }
            map.fitBounds(bounds);
        }
    };

    var createMarker = function(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        bounds.extend(marker.getPosition());

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    };

    var sortByRatings = function(place) {
        _.sortBy(users, ['user', 'age']);
    }

    var createListItem = function(place) {
        $('<li />')
            .html(
                '<h2>' + place.name + '</h2>' +
                '<h3>'  + place.rating + '</h3>'
            )
            .appendTo('.sidenav');
    };

    var sortNumber = function(a,b) {
        return a - b;
    }

// var numArray = [140000, 104, 99];
// numArray.sort(sortNumber);

    return {
        init: init,
        nearbySearchCallback: nearbySearchCallback,
        createMarker: createMarker
    };
})();
