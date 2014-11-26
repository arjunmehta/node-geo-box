var test = require('assert');
var boxInfo = require('../main.js');

var lat = 43.646838,
    lon = -79.403723;

exports.differentSetsWithValues = function(test){

  test.expect(1);

  var bitDepth = boxInfo.bitDepthForRadiusAtLat(5000, lat);
  // console.log("BIT DEPTH IS", bitDepth);

  test.equal(bitDepth, 24);

  test.done();
};

exports.geohashBoxDegreeDistortion = function(test){

  test.expect(1);

  var distortion = boxInfo.geohashPhysicalDistortionAtLat(lat);
  // console.log("DISTORTION IS", distortion);

  test.equal(distortion, 1.4472157423927816);

  test.done();
};

exports.geohashBoxDegreeSize = function(test){

  test.expect(2);

  var geohashBox = boxInfo.geohashBoxInDegrees(lat, 45, 10);
  // console.log("Box SIZE", geohashBox);

  test.equal(geohashBox.degHeight, 5.625);
  test.equal(geohashBox.degWidth, 11.25);

  test.done();
};

exports.geohashBoxMeterSize = function(test){

  test.expect(4);

  var geohashBox = boxInfo.geohashBoxInMeters(lat, 45, 10);
  // console.log("Box SIZE in METERS", geohashBox);

  test.equal(geohashBox.height, 5009348.025965265);
  test.equal(geohashBox.width, 4784900.787635698);
  test.equal(geohashBox.boxGeneralSize, 4897124.4068004815);
  test.equal(geohashBox.boxDistortion, 0.9551943212637302);

  test.done();
};

exports.convertBoxFromDegreesToMeters = function(test){

  test.expect(2);

  var box = boxInfo.convertBoxFromDegreesToMeters(1, 1, 73);
  // console.log("Box SIZE in METERS", box);

  test.equal(box.height, 111318.84502145034);
  test.equal(box.width, 32546.480486687575);

  test.done();
};

exports.convertBoxFromDegreesToMetersAtZeroLat = function(test){

  test.expect(3);

  var box = boxInfo.convertBoxFromDegreesToMeters(1, 1, 0);
  // console.log("Box SIZE in METERS", box);

  test.equal(box.height, 111318.84502145034);
  test.equal(box.width, 111318.84502145034);
  test.equal(box.width, box.height);

  test.done();
};

exports.convertBoxFromMetersToDegrees = function(test){

  test.expect(2);

  var box = boxInfo.convertBoxFromMetersToDegrees(100000, 100000, 73);
  // console.log("Box SIZE in Degrees", box);

  test.equal(box.degHeight, 0.8983204953368922);
  test.equal(box.degWidth, 3.0725288419711867);

  test.done();
};

exports.convertBoxFromMetersToDegreesAtZeroLat = function(test){

  test.expect(3);

  var box = boxInfo.convertBoxFromMetersToDegrees(100000, 100000, 0);
  // console.log("Box SIZE in Degrees", box);

  test.equal(box.degHeight, 0.8983204953368922);
  test.equal(box.degWidth, 0.8983204953368922);
  test.equal(box.degWidth, box.degHeight);

  test.done();
};

exports.box = function(test){

  test.expect(1);

  var box = boxInfo.box(lat, lon, 3000, 2000, "meters");
  printBox(box);
  box.lat = 85;
  printBox(box);
  box.setBaseUnit('degrees').lat = 40;
  printBox(box);
  test.equal(true, true);

  test.done();
};


exports.tearDown = function(done){
  done();
};


return exports;

function  printBox(box){
  for(var prop in box){
    console.log("property:", prop, box[prop]);
  }
}