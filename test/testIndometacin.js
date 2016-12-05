'use strict';

const NmrPredictor = require('..');
const request = require('request');
const fs = require('fs');

const db = JSON.parse(fs.readFileSync(__dirname + "/h1_database.json").toString());


const molfile = `
  -ISIS-  07020715012D

 25 27  0  0  0  0  0  0  0  0999 V2000
    5.7526   -2.5902    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.7526   -1.7654    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.5339   -2.8440    0.0000 N   0  0  3  0  0  0  0  0  0  0  0  0
    5.0379   -3.0023    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.5339   -1.5116    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.0379   -1.3533    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.0167   -2.1740    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.7880   -3.6314    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.3240   -2.5902    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.7880   -0.7242    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.3240   -1.7654    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.8439   -2.1698    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.5895   -3.8059    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.2359   -4.2392    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    6.2353   -0.1164    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.6010   -1.3449    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    7.8436   -4.5891    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.1417   -3.1939    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.4833    0.6674    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    5.4311   -0.2957    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    3.6079   -0.5154    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.6458   -4.7637    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.9480   -3.3684    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    9.2022   -4.1557    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   10.0120   -4.3387    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  2  0  0  0  0
  2  5  1  0  0  0  0
  2  6  2  0  0  0  0
  3  7  1  0  0  0  0
  3  8  1  0  0  0  0
  4  9  1  0  0  0  0
  5 10  1  0  0  0  0
  6 11  1  0  0  0  0
  7 12  1  0  0  0  0
  8 13  1  0  0  0  0
  8 14  2  0  0  0  0
 10 15  1  0  0  0  0
 11 16  1  0  0  0  0
 13 17  1  0  0  0  0
 13 18  2  0  0  0  0
 15 19  1  0  0  0  0
 15 20  2  0  0  0  0
 16 21  1  0  0  0  0
 17 22  2  0  0  0  0
 18 23  1  0  0  0  0
 22 24  1  0  0  0  0
 24 25  1  0  0  0  0
  5  7  2  0  0  0  0
  9 11  2  0  0  0  0
 23 24  2  0  0  0  0
M  END
`;


describe('Ask Erno prediction indometacin', function () {
    it('1H chemical shift prediction no labile', function () {
        var predictor = new NmrPredictor(db);
        var prediction = predictor.predict(molfile);
        prediction.length.should.eql(15);
    });

    it('1H chemical shift prediction with labile', function () {
        var predictor = new NmrPredictor(db);
        var prediction = predictor.predict(molfile, {ignoreLabile: false});
        prediction.length.should.eql(16);
    });
});