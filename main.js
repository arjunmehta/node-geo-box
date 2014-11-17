var ngeohash = require('ngeohash');

var radiusOfTheEarth = 6378100;
var aDegreeInRadian = (2*Math.PI/360);
var aDegreeOfTheEarth = aDegreeInRadian * radiusOfTheEarth;

var intRadiiMap = [];

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

var lat = 30;

console.log("Width of 1 Degree at Latitude", getWidthAtLat(lat, 1));
console.log("Height of 1 Degree At Longitude", getHeightAtLon(1));
console.log("Number of Degrees of Width at Latitude", getDegreeWidthOfWidthAtLat(500000, lat));
console.log("Number of Degrees of Height at Longitude", getDegreeHeightOfHeightAtLon(500000));
console.log("box Distortion", getBoxDistortionAtLat(lat));

console.log("///////////////TESTING PRECISION");



// for(var i=4; i<54; i+=2){
//   geohash = ngeohash.encode_int(lat, 79.4, i);
//   decode = ngeohash.decode_bbox_int(geohash, i);
//   latError = decode[2] - decode[0];
//   lonError = decode[3] - decode[1];

//   latErrorHeight = getHeightAtLon(latError);
//   lonErrorWidth = getWidthAtLat(lat, lonError);
//   distortion = lonErrorWidth/latErrorHeight;

//   // console.log("////////HASH", i, geohash);
//   // console.log("LOCATION:", ngeohash.decode_int(geohash, i).latitude, ",", ngeohash.decode_int(geohash, i).longitude);
//   console.log("ERROR",  latError, ",", lonError);
//   // console.log("ErrorSize:", latErrorHeight, lonErrorWidth);
//   console.log("Average Radius at ", i, (latErrorHeight+lonErrorWidth)/2, "Lat Error Height", latErrorHeight, "lon Error Width", lonErrorWidth, distortion);

// }


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

  var maps = {
    map: map,
    fullMap: fullMap
  };

  var latAttributes = {};

  var geohash = 0;
  var latError = 0;
  var lonError = 0;
  var decode = [];
  var distortion = 0;

  for(var i=2; i<54; i+=2){
    geohash = ngeohash.encode_int(lat, 79.4, i);
    decode = ngeohash.decode_bbox_int(geohash, i);
    latError = decode[2] - decode[0];
    lonError = decode[3] - decode[1];

    latErrorHeight = getHeightAtLon(latError);
    lonErrorWidth = getWidthAtLat(lat, lonError);
    distortion = lonErrorWidth/latErrorHeight;
    // console.log("ERROR",  latError, ",", lonError);
    // console.log("Average Radius at ", i, (latErrorHeight+lonErrorWidth)/2, "Lat Error Height", latErrorHeight, "lon Error Width", lonErrorWidth, distortion);    
    

    latAttributes = {
      latBoxHeight: latErrorHeight,
      lonBoxWidth: lonErrorWidth,
      averageBoxSize: (latErrorHeight+lonErrorWidth)/2,
      boxDistortion: distortion
    };

    maps.fullMap.push(latAttributes);
    maps.map.push(latAttributes.averageBoxSize);   
    
  }

  return map;
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



intRadiiMap = generateIntRadiusMap();
console.log(Math.round(90) + 90, intRadiiMap.length);
console.log(intRadiiMap[Math.round(43) + 90]);
console.log(bitDepthForRadiusAtLat(5000, 43));

