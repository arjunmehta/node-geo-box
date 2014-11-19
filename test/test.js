var test = require('assert');
var boxInfo = require('../main.js');

var lat = 43.646838,
    lon = -79.403723;

exports.differentSetsWithValues = function(test){

  test.expect(1);

  var bitDepth = boxInfo.bitDepthForRadiusAtLat(5000, lat);
  console.log("BIT DEPTH IS", bitDepth);

  test.equal(bitDepth, 24);
  test.done();
};

exports.geohashBoxDegreeDistortion = function(test){

  test.expect(1);

  var distortion = boxInfo.geohashPhysicalDistortionAtLat(lat);
  console.log("DISTORTION IS", distortion);

  test.equal(distortion, 1.4472157423927816);
  test.done();
};

exports.geohashBoxDegreeSize = function(test){

  test.expect(2);

  var geohashBox = boxInfo.geohashBoxDegreeSize(lat, 45, 10);
  console.log("Box SIZE", geohashBox);

  test.equal(geohashBox.degHeight, 5.625);
  test.equal(geohashBox.degWidth, 11.25);
  test.done();
};

exports.tearDown = function(done){
  done();
};


return exports;