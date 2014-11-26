var ngeohash = require('ngeohash');

var radiusOfTheEarth = 6378100;
var aDegreeInRadian = (2*Math.PI/360);
// how many meters is 1 (base) degree of the earth
var aDegreeOfTheEarth = aDegreeInRadian * radiusOfTheEarth;

var intRadiiMap = generateIntRadiusMap();

function getMeterWidthAtLat(degDelta, lat){
  return aDegreeOfTheEarth * Math.cos(lat*aDegreeInRadian) * degDelta;
}

function getMeterHeightAtLon(degDelta){
  return aDegreeOfTheEarth * degDelta;
}

// how many degrees is latWidth meters at a certain latitude
function getDegreeWidthOfWidthAtLat(latWidth, lat){
  return latWidth/getMeterWidthAtLat(1, lat);
}

function getDegreeHeightOfHeightAtLon(lonHeight){
  return lonHeight/aDegreeOfTheEarth;
}

function getBoxDistortionAtLat(lat){
  return getDegreeWidthOfWidthAtLat(50, lat)/getDegreeHeightOfHeightAtLon(50);
}

function convertBoxFromDegreesToMeters(degWidth, degHeight, lat){
  return {
    width: getMeterWidthAtLat(degWidth, lat),
    height: getMeterHeightAtLon(degHeight)
  };
}

function convertBoxFromMetersToDegrees(width, height, lat){
  return {
    degWidth: getDegreeWidthOfWidthAtLat(width, lat),
    degHeight: getDegreeHeightOfHeightAtLon(height)
  };
}

function geohashPhysicalDistortionAtLat(lat, lon, bitDepth){
  var geoHashBox = geohashBoxDegreeSize(lat, lon, bitDepth);
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
    var lonWidthInMeters = getMeterWidthAtLat(degreeWidth, lat);
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
  // console.log("Length of Map", mapForLat.length);

  for(var i=mapForLat.length-1; i > -1; i--){
    // console.log("Position:", i, "| Avg Box Size:", mapForLat[i], radius - mapForLat[i], mapForLat[i-1] - radius);
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


function box(lat, lon, width, height, units){
  return new Box(lat, lon, width, height, units);
}



var Box = function(lat, lon, width, height, units){

  units = units || "degrees";

  var degWidth = 0,
      degHeight = 0;

  if(units === "degrees"){
    degWidth = width;
    degHeight = height;
    width = getMeterWidthAtLat(degWidth, lat);
    height = getMeterHeightAtLon(degHeight);
  }
  else{
    degWidth = getDegreeWidthOfWidthAtLat(width, lat);
    degHeight = getDegreeHeightOfHeightAtLon(height);
  }


  Object.defineProperty(this, "baseUnit", {
    enumerable: true,
    get: function () {
      return units;
    },
    set: function(newBaseUnit){
      units = newBaseUnit;
    }
  });


  Object.defineProperty(this, "lat", {
    enumerable: true,
    get: function () {
      return lat;
    },
    set: function(newLat){
      if (this.baseUnit === 'degrees'){
        lat = newLat;
        width = getMeterWidthAtLat(degWidth, lat);
      }
      else{
        lat = newLat;
        degWidth = getDegreeWidthOfWidthAtLat(width, lat);
      }
    }
  });

  Object.defineProperty(this, "lon", {
    enumerable: true,
    get: function () {
      return lon;
    },
    set: function(newLon){
      lon = newLon;
    }
  });

  Object.defineProperty(this, "center", {
    enumerable: true,
    get: function () {
      return [lat + (degHeight/2), lon + (degWidth/2)];
    },
    set: function(center){
      lat = center[0] - (degHeight/2);
      lon = center[1] - (degWidth/2);
    }
  });


  Object.defineProperty(this, "width", {
    enumerable: true,
    get: function () {
      return width;
    },
    set: function(meterWidth){
      width = meterWidth;
      degWidth = getDegreeWidthOfWidthAtLat(meterWidth, lat);
    }
  });

  Object.defineProperty(this, "height", {
    enumerable: true,
    get: function () {
      return height;
    },
    set: function(meterHeight){
      height = meterHeight;
      degHeight = getDegreeHeightOfHeightAtLon(meterHeight);
    }
  });

  Object.defineProperty(this, "diagonal", {
    enumerable: true,
    get: function () {
      return Math.sqrt(width*width + height*height);
    }
  });

  Object.defineProperty(this, "distortion", {
    enumerable: true,
    get: function () {
      return width/height;
    }
  });


  Object.defineProperty(this, "degWidth", {
    enumerable: true,
    get: function () {
      return degWidth;
    },
    set: function(newDegWidth){
      degWidth = newDegWidth;
      width = getMeterWidthAtLat(newDegWidth, lat);
    }
  });

  Object.defineProperty(this, "degHeight", {
    enumerable: true,
    get: function () {
      return degHeight;
    },
    set: function(newDegHeight){
      degHeight = newDegHeight;
      height = getMeterHeightAtLon(newDegHeight);
    }
  });
};

Object.defineProperty(Box.prototype, "fromGeohash", {
  enumerable: false,
  value: function(geohash, bitDepth){
    var decode = [];

    if(typeof geohash === 'number'){
      decode = ngeohash.decode_bbox_int(geohash, bitDepth || 52);
    }
    else if(typeof geohash === 'string'){
      decode = ngeohash.decode_bbox(geohash);
    }

    return new Box(decode[0], decode[1], decode[3] - decode[1], decode[2] - decode[0], "degrees");
  }
});

Object.defineProperty(Box.prototype, "setBaseUnit", {
  enumerable: false,
  value: function(units){
    console.log(units);
    if(units === 'degrees'){
      this.baseUnit = 'degrees';
      console.log("is degrees");
      console.log(this.baseUnit);
    }
    else{
      this.baseUnit = 'meters';
    }
    return this;
  }
});


var geoBoxInfo = {
  'bitDepthForRadiusAtLat': bitDepthForRadiusAtLat,
  'geohashPhysicalDistortionAtLat': geohashPhysicalDistortionAtLat,
  'geohashBoxInDegrees': geohashBoxDegreeSize,
  'geohashBoxInMeters': boxAttributesAtLat,
  'convertBoxFromDegreesToMeters': convertBoxFromDegreesToMeters,
  'convertBoxFromMetersToDegrees': convertBoxFromMetersToDegrees,
  'physicalDistortionAtLat': getBoxDistortionAtLat,
  'box': box
};

module.exports = geoBoxInfo;
