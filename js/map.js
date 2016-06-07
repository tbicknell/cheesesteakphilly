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
            render(sortedResults);
        }
    };

    var render = function(places) {
        var data = {
            places: places
        };
        var listGroup = $('.list-group');
        var source = $('#list-template').html();
        var template = Handlebars.compile(source);
        var ratingSource = $('#rating-template').html();
        Handlebars.registerPartial('ratingPartial', ratingSource);
        listGroup.html(template(data));
    };

    var createMarker = function(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: place.geometry.location
        });

        bounds.extend(marker.getPosition());
        bindEvents(place, marker);
    };

    var setInfowindow = function(place, marker) {
        infowindow.setContent('<h5>' + place.name + '</h5><p>' + place.vicinity + '</p><a href="/detail?placeId=' + place.place_id + '">full details</a>');
        infowindow.open(map, marker);
    };

    var bindEvents = function(place, marker) {
        google.maps.event.addListener(marker, 'click', function() {
            setInfowindow(place, marker);
        });

        $(document).on('touchend click', '#'+place.id, function() {
            $('.active').removeClass('active');
            $(this).addClass('active');
            map.panTo(marker.getPosition());
            map.setZoom(13);
            setInfowindow(place, marker);
        });
    };

    return {
        init: init
    };
})();
