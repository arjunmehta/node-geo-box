var ngeohash = require('ngeohash');

var radiusOfTheEarth = 6378100;
var aDegreeInRadian = (2*Math.PI/360);
var aDegreeOfTheEarth = aDegreeInRadian * radiusOfTheEarth;

var maps = {
  map: map,
  fullMap: fullMap
};

var intRadiiMap = generateIntRadiusMap();

function getWidthAtLat(lat, precision){
  return aDegreeOfTheEarth * Math.cos(lat*aDegreeInRadian) * precision;
}

function getHeightAtLon(precision){
  return aDegreeOfTheEarth * precision;
}

function getDegreeWidthOfWidthAtLat(latWidth, lat){
  return latWidth/getWidthAtLat(lat, 1);
}

function getDegreeHeightOfHeightAtLon(lonHeight){
  return lonHeight/aDegreeOfTheEarth;
}

function getBoxDistortionAtLat(lat){
  return getDegreeWidthOfWidthAtLat(50, lat)/getDegreeHeightOfHeightAtLon(50);
}

function getGeoHashDistortionAtLat(lat){

}

function generateIntRadiusMap(){

  var map = [];
  for(var i=-90; i<91; i++){
    map.push(generateIntRadiusMapForLat(i));
  }
  return map;
}


function generateIntRadiusMapForLat(lat){

  var map = [];
  var fullMap = [];

  var latAttributes = {};

  var hash = 0,
      latError = 0,
      lonError = 0,
      decode = [],
      distortion = 0;

  var geoHashBox = [];

  for(var i=2; i<54; i+=2){

    geoHashBox = geohashBoxDegreeSize(lat, 50, i);
    latAttributes = boxAttributesAtLat(geoHashBox.lonError, geoHashBox.latError, lat);
    maps.fullMap.push(latAttributes);
    maps.map.push(latAttributes.averageBoxSize);   
    
  }

  return map;
}

function geohashBoxDegreeSize(lat, lon, bitDepth){

  var hash = ngeohash.encode_int(lat, lon, bitDepth);
  var decode = ngeohash.decode_bbox_int(hash, bitDepth);

  return {
    latError: decode[2] - decode[0],
    lonError: decode[3] - decode[1]
  };
}

function boxAttributesAtLat(degreeWidth, degreeHeight, lat){

    var latErrorHeight = getHeightAtLon(degreeHeight);
    var lonErrorWidth = getWidthAtLat(lat, degreeWidth);
    var distortion = lonErrorWidth/latErrorHeight;

    return {
      latBoxHeight: latErrorHeight,
      lonBoxWidth: lonErrorWidth,
      averageBoxSize: (latErrorHeight+lonErrorWidth)/2,
      boxDistortion: distortion
    };
}

function bitDepthForRadiusAtLat(radius, lat){

  var mapForLat = intRadiiMap[Math.round(lat) + 90];
  // console.log("Length of Map", mapForLat.length);

  for(var i=mapForLat.length-1; i > -1; i--){
    console.log(i, mapForLat[i], radius - mapForLat[i], mapForLat[i-1] - radius);
    if(radius - mapForLat[i] < mapForLat[i-1] - radius){
      return ((i*2)+2);
    }
  }
  return 2;
}



function geohashBoxDistortionAt(lat){

}



// intRadiiMap = 
// console.log(Math.round(90) + 90, intRadiiMap.length);
// console.log(intRadiiMap[Math.round(43) + 90]);
// console.log(bitDepthForRadiusAtLat(5000, 43));



var geoBoxInfo = {
  'bitDepthForRadiusAtLat': bitDepthForRadiusAtLat
};


module.exports = geoBoxInfo;
