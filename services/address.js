const axios = require('axios');

const config = {
    google: {
        maps: 'https://maps.googleapis.com/maps/api/',
        key: 'AIzaSyBtvGy-VKFY8WR4D6O5OmWY02InfLtFOuI'
    }
}

const apis = {
    geocode: 'geocode',
    directions: 'directions'
};
const baseUrl = api => `${config.google.maps}${api}/json`;

module.exports.drawRoute = drawRoute;

async function getCoordinates(type, value) {
    const url = `${baseUrl(apis['geocode'])}?key=${
    config.google.key
  }&${type}=${value}`;
    const mapsApi = axios.create({
        baseURL: url,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
    const response = await mapsApi.get();
    return response.data.results[0];
}

function decode(encoded) {
    var points = []
    var index = 0,
        len = encoded.length;
    var lat = 0,
        lng = 0;
    while (index < len) {
        var b, shift = 0,
            result = 0;
        do {

            b = encoded.charAt(index++).charCodeAt(0) - 63; //finds ascii                                                                                    //and substract it by 63
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);


        var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        points.push({
            lat: (lat / 1E5),
            lng: (lng / 1E5)
        })
    }

    return points;
}


async function getCoordinatesFromAddress(address) {
    const result = await getCoordinates('address', address);
    return result.geometry.location;
}

async function drawRoute(origin, destination) {
    const url = `${baseUrl(apis['directions'])}?key=${
    config.google.key
  }&mode=driving&origin=${origin.lat},${origin.lng}&destination=${
    destination.lat
  },${destination.lng}`;

    console.log(url);
    const mapsApi = axios.create({
        baseURL: url,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
    const response = (await mapsApi.get()).data;
    const coords = decode(response.routes[0].overview_polyline.points);
    return coords;
}