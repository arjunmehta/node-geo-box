var ngeohash = require('ngeohash');

var radiusOfTheEarth = 6378100;
var aDegreeInRadian = (2*Math.PI/360);

// how many meters is 1 (base) degree of the earth
var aDegreeOfTheEarth = aDegreeInRadian * radiusOfTheEarth;

var maps = [];

var intRadiiMap = generateIntRadiusMap();

function getMeterWidthAtLat(lat, precision){
  return aDegreeOfTheEarth * Math.cos(lat*aDegreeInRadian) * precision;
}

function getMeterHeightAtLon(precision){
  return aDegreeOfTheEarth * precision;
}

// how many degrees is latWidth meters at a certain latitude
function getDegreeWidthOfWidthAtLat(latWidth, lat){
  return latWidth/getMeterWidthAtLat(lat, 1);
}

function getDegreeHeightOfHeightAtLon(lonHeight){
  return lonHeight/aDegreeOfTheEarth;
}

function getBoxDistortionAtLat(lat){
  return getDegreeWidthOfWidthAtLat(50, lat)/getDegreeHeightOfHeightAtLon(50);
}

function geohashPhysicalDistortionAtLat(lat, bitDepth){
  var geoHashBox = geohashBoxDegreeSize(lat, 50, bitDepth || 52);
  var latAttributes = boxAttributesAtLat(geoHashBox.degWidth, geoHashBox.degHeight, lat);
  return latAttributes.boxDistortion;
}



function generateIntRadiusMapForLat(lat){

  var latAttributes = {},
      geoHashBox = [],
      map = [],
      fullMap = [];

  for(var i=2; i<54; i+=2){
    geoHashBox = geohashBoxDegreeSize(lat, 50, i);
    latAttributes = boxAttributesAtLat(geoHashBox.degWidth, geoHashBox.degHeight, lat);
    fullMap.push(latAttributes);
    map.push(latAttributes.boxGeneralSize);
  }

  return map;
}

function geohashBoxDegreeSize(lat, lon, bitDepth){

  var hash = ngeohash.encode_int(lat, lon || 45, bitDepth || 52);
  var decode = ngeohash.decode_bbox_int(hash, bitDepth || 52);

  return {
    degHeight: decode[2] - decode[0],
    degWidth: decode[3] - decode[1]
  };
}

function boxAttributesAtLat(degreeWidth, degreeHeight, lat){

    var latHeightInMeters = getMeterHeightAtLon(degreeHeight);
    var lonWidthInMeters = getMeterWidthAtLat(lat, degreeWidth);
    var distortion = lonWidthInMeters/latHeightInMeters;

    return {
      height: latHeightInMeters,
      width: lonWidthInMeters,
      boxGeneralSize: (latHeightInMeters+lonWidthInMeters)/2,
      boxDistortion: distortion
    };
}

function bitDepthForRadiusAtLat(radius, lat){

  var mapForLat = intRadiiMap[Math.round(lat) + 90];
  console.log("Length of Map", mapForLat.length);

  for(var i=mapForLat.length-1; i > -1; i--){
    console.log("Position:", i, "| Avg Box Size:", mapForLat[i], radius - mapForLat[i], mapForLat[i-1] - radius);
    if(radius - mapForLat[i] < mapForLat[i-1] - radius){
      return ((i*2)+2);
    }
  }
  return 2;
}

function generateIntRadiusMap(){

  var map = [];
  for(var i=-90; i<91; i++){
    map.push(generateIntRadiusMapForLat(i));
  }
  return map;
}








var geoBoxInfo = {
  'bitDepthForRadiusAtLat': bitDepthForRadiusAtLat,
  'geohashPhysicalDistortionAtLat': geohashPhysicalDistortionAtLat,
  'geohashBoxDegreeSize': geohashBoxDegreeSize,
  'geohashBoxMeterSize': boxAttributesAtLat
};

module.exports = geoBoxInfo;
