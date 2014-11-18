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

exports.tearDown = function(done){
  done();
};


return exports;