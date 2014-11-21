node-geo-box
=====================

[![Build Status](https://travis-ci.org/arjunmehta/node-geo-proximity.svg?branch=master)](https://travis-ci.org/arjunmehta/node-geo-proximity)

A node.js module that provides useful geographic box information (including geohash boxes!) for unit conversion, distortion measurement and equivelency.

, including box distortion as a function of latitude, conversion from degrees to meters, and meters to degrees. Similarly useful information about geohash boxes are provided in this module as well, including geohash box distortion, geohash box size in meters, and equivelency of geohash bit depth to box size in meters.

This module uses general estimate calculations. Please leave feedback in the module's [GitHub issues tracker](https://github.com/arjunmehta/node-geo-boxinfo/issues).

## Installation

```bash
npm install geo-box
```


## Usage
```javascript
var geoBox = require('geo-boxinfo');
```

Create a box at (43, -79), 2000m wide and 2000m high.
```javascript
// box defined by lat, lon, width and height in meters
var box = geoBox.box(43, -79, 2000, 2000, "meters");

// box defined by lat, lon, width and height in geographic degrees
var box = geoBox.box(43, -79, 2.3, 2, "degrees");

// box defined by geohash. If you are using an integer geohash you must specify the bit depth of the geohash.
var box = geoBox.box().fromGeohash("aga27tag");
var box = geoBox.box().fromGeohash(28718761);

// box.center = [43, -79];

box.lat;
box.lon;
box.center;

box.degWidth;
box.degHeight;

box.width;
box.height;
box.diagonal;
box.distortionRatio;

box.geohashBitDepthSizeEquivelent;

bitDepthForRadiusAtLat
geohashPhysicalDistortionAtLat
geohashBoxInDegrees
geohashBoxInMeters
convertBoxFromDegreesToMeters
convertBoxFromMetersToDegrees
physicalDistortionAtLat
```


## API

### proximity.addCoordinate(lat, lon, coordinateName, {options}, callBack);
Add a new coordinate to your set. You can get quite technical here by specifying the geohash integer resolution at which to store (MUST BE CONSISTENT).

#### Options
- `bitDepth: {Number, default is 52}`: the bit depth you want to store your geohashes in, usually the highest possible (52 bits for javascript). MUST BE CONSISTENT. If you set this to another value other than 52, you will have to ensure you set bitDepth in options for querying methods.
- `client: {redisClient}`
- `zset: {String}`

### proximity.addCoordinates(coordinateArray, {options}, callBack);
Adds an array of new coordinates to your set. The `coordinateArray` must be in the form `[[lat, lon, name],[lat, lon, name],...,[lat, lon, name]]`. Again you can specify the geohash integer resolution at which to store (MUST BE CONSISTENT). Use this method for bulk additions, as it is much faster than individual adds.

#### Options
- `bitDepth: {Number, default is 52}`: the bit depth you want to store your geohashes in, usually the highest possible (52 bits for javascript). MUST BE CONSISTENT. If you set this to another value other than 52, you will have to ensure you set bitDepth in options for querying methods.
- `client: {redisClient}`
- `zset: {String}`



## License

The MIT License (MIT)

Copyright (c) 2014 Arjun Mehta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
