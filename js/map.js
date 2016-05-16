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
        // sort results by descending rating
        sortedResults = _.sortBy(results, ['rating']).reverse();

        // remove any undefined ratings
        sortedResults = _.remove(sortedResults, function(n) {
            return n.rating !== undefined;
        });
        console.log(sortedResults);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < sortedResults.length; i++) {
                createMarker(sortedResults[i]);
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
        createListItem(place, marker);
        google.maps.event.addListener(marker, 'click', function() {
            setInfowindow(place, marker);
        });
    };

    var setInfowindow = function(place, marker) {
        infowindow.setContent(place.name);
        infowindow.open(map, marker);
    };

    var createListItem = function(place, marker) {
        $('<a class="list-group-item" />')
            .html('<h3 class="list-group-item-heading">' + place.name + '</h3><div class="rating-container"><span class="rating-number">' + place.rating + '</span><div class="rating-stars"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100"><defs><path id="a" d="M0 0h500v100H0V0zm50 79L20.6 94.5l5.6-32.8L2.4 38.5l33-4.7L50 4l14.7 29.8 33 4.7-24 23.2 5.7 32.8L50 79zm100 0l-29.4 15.5 5.6-32.8-23.8-23.2 33-4.7L150 4l14.7 29.8 33 4.7-24 23.2 5.7 32.8L150 79zm100 0l-29.4 15.5 5.6-32.8-23.8-23.2 33-4.7L250 4l14.7 29.8 33 4.7-24 23.2 5.7 32.8L250 79zm100 0l-29.4 15.5 5.6-32.8-23.8-23.2 33-4.7L350 4l14.7 29.8 33 4.7-24 23.2 5.7 32.8L350 79zm100 0l-29.4 15.5 5.6-32.8-23.8-23.2 33-4.7L450 4l14.7 29.8 33 4.7-24 23.2 5.7 32.8L450 79z"/></defs><use fill-rule="evenodd" xlink:href="#a"/></svg><meter min="0" max="5" value="' + place.rating + '"></meter></div></div>')
            .click(function() {
                $('.active').removeClass('active');
                $(this).addClass('active');
                map.panTo(marker.getPosition());
                map.setZoom(13);
                setInfowindow(place, marker);
            })
            .appendTo('.list-group');
    };

    return {
        init: init
    };
})();
