mapboxgl.accessToken =
    "pk.eyJ1Ijoic2FyYWhzaGtiIiwiYSI6ImNqbngwZnFyYzA3NHczcW43b2JzaXVsdnUifQ.CMFPd71aM-oMCSAMAr76oQ";

mapboxgl.setRTLTextPlugin(
    "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js"
);

var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v10",
    center: [54.538, 32.4946],
    zoom: 5
});

$(document).ready(function() {
    map.on("click", selectStart);
});

let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});

map.addControl(geolocate);

addRandomTaxi();

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function addRandomTaxi() {
    for (let i = 0; i < 10; i++) {
        let randLng = getRandomArbitrary(51.35, 51.379999999999999);
        let randLat = getRandomArbitrary(35.76, 35.782999999999999);
        let lngLat = {
            lng: randLng,
            lat: randLat
        };
        addTaxi(lngLat);
    }
}

function addTaxi(lngLat) {
    let z = JSON.stringify(lngLat);

    let taxi = document.createElement("div");
    taxi.className = "taxiMarker";
    marker = new mapboxgl.Marker(taxi).setLngLat(lngLat).addTo(map);
}

function selectStart(e) {
    let z = JSON.stringify(e.lngLat);

    if (typeof startPoint !== "undefined") {
        startPoint.remove();
    }

    let start = document.createElement("div");
    start.className = "startMarker";
    startPoint = new mapboxgl.Marker(start).setLngLat(e.lngLat).addTo(map);
}

function selectDestination(e) {
    let z = JSON.stringify(e.lngLat);

    if (typeof destinationtPoint !== "undefined") {
        destinationtPoint.remove();
    }

    let destination = document.createElement("div");
    destination.className = "destinationMarker";
    destinationtPoint = new mapboxgl.Marker(destination)
        .setLngLat(e.lngLat)
        .addTo(map);
}

$("#destination").on("click", function() {
    map.off("click", selectStart);
    map.on("click", selectDestination);
    $("#start").removeAttr("disabled");
});

$("#start").on("click", function() {
    map.off("click", selectDestination);
    map.on("click", selectStart);
});

$("#map div .mapboxgl-canvas").css({
    height: "100% !important",

    padding: "0",
    margin: "auto",
    display: "block",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0"
});
