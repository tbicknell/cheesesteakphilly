'use strict';

var detailModule = (function() {
    var map;

    var init = function () {
        var philly = { lat: 39.9526, lng: -75.1652 };
        var mapElement = document.getElementById('detail-map');
        var mapOptions = {
            center: philly,
            zoom: 15,
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}]
        };
        map = new google.maps.Map(mapElement, mapOptions);
        var placeId = getQueryVariable('placeId');
        var service = new google.maps.places.PlacesService(map);
        var request = {
            placeId: placeId
        };

        service.getDetails(request, getDetailsCallback);
    };

    var getDetailsCallback = function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(place);
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            map.panTo(marker.getPosition());
            map.setZoom(15);
            render(place);
        }
    };

    var render = function(place) {
        var placePhotos = [];

        for (var i = 0; i < place.photos.length; i++) {
            placePhotos.push(Object.assign({url: place.photos[i].getUrl({'maxWidth': 200, 'maxHeight': 200})}, place.photos[i]));
        }

        place.photos = placePhotos;
        Handlebars.registerHelper('photourl', function(object) {
            var url = Handlebars.escapeExpression(object);

            return new Handlebars.SafeString(
                "<img src='" + url + "' />"
            );
        });
        var detailInfo = $('.detail-info');
        var source = $('#detail-template').html();
        var template = Handlebars.compile(source);
        detailInfo.html(template(place));

    }

    var getQueryVariable = function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    };

    return {
        init: init
    };
})();
