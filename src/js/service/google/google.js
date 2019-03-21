app.service("GoogleService", GoogleService);

function GoogleService(){

    var geocoder;
    var map;
    var address;

    var _priv = {
        initialize: function(config){
            var uluru = {lat: config.latitude, 
                         lng:config.longitude};
            var map = new google.maps.Map(document.getElementById(config.id), {
              zoom: config.zoom,
              center: uluru
            });
            var marker = new google.maps.Marker({
              position: uluru,
              map: map
            });
        }
    };
    return{
        initialize: _priv.initialize
    };
}