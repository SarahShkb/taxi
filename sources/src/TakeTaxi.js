mapboxgl.accessToken =
    "pk.eyJ1Ijoic2FyYWhzaGtiIiwiYSI6ImNqbngwZnFyYzA3NHczcW43b2JzaXVsdnUifQ.CMFPd71aM-oMCSAMAr76oQ";

mapboxgl.setRTLTextPlugin(
    "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js"
);

var startLoc, endLoc;

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

async function callRoute(url) {
    try {
        let xxx = await $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            withCredentials: true,
            contentType: "application/json"
        });

        return xxx;
    } catch (error) {
        console.log(error);
    }
}

async function getRoute(startLoc, endLoc) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    console.log(startLoc);
    console.log(endLoc);
    var url =
        "https://api.mapbox.com/directions/v5/mapbox/driving/" +
        startLoc[0] +
        "," +
        startLoc[1] +
        ";" +
        endLoc[0] +
        "," +
        endLoc[1] +
        "?steps=true&geometries=geojson&access_token=" +
        "pk.eyJ1Ijoic2FyYWhzaGtiIiwiYSI6ImNqbngwZnFyYzA3NHczcW43b2JzaXVsdnUifQ.CMFPd71aM-oMCSAMAr76oQ";

    // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

    let xxx = await callRoute(url);

    var data = xxx.routes[0];
    var route = data.geometry.coordinates;
    var geojson = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "LineString",
            coordinates: route
        }
    };
    // if the route already exists on the map, reset it using setData
    if (map.getSource("route")) {
        console.log("in if");
        map.getSource("route").setData(geojson);
    } else {
        console.log("in else");
        // otherwise, make a new request
        map.addLayer({
            id: "route",
            type: "line",
            source: {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: geojson
                    }
                }
            },
            layout: {
                "line-join": "round",
                "line-cap": "round"
            },
            paint: {
                "line-color": "#ff0071",
                "line-width": 5,
                "line-opacity": 0.75
            }
        });
    }
    // add turn instructions here at the end
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
    startLoc = Object.keys(e.lngLat).map(function(key) {
        return e.lngLat[key];
    });

    if (typeof startPoint !== "undefined") {
        startPoint.remove();
    }

    let start = document.createElement("div");
    start.className = "startMarker";
    startPoint = new mapboxgl.Marker(start).setLngLat(e.lngLat).addTo(map);
    $("#destination").removeAttr("disabled");
}

function selectDestination(e) {
    endLoc = Object.keys(e.lngLat).map(function(key) {
        return e.lngLat[key];
    });

    if (typeof destinationtPoint !== "undefined") {
        destinationtPoint.remove();
    }

    let destination = document.createElement("div");
    destination.className = "destinationMarker";
    destinationtPoint = new mapboxgl.Marker(destination)
        .setLngLat(e.lngLat)
        .addTo(map);

    getRoute(startLoc, endLoc);
}

$("#destination").on("click", function() {
    map.off("click", selectStart);
    map.on("click", selectDestination);
    $("#start").removeAttr("disabled");
    $("#takeTaxi").show();
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
