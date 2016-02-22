'use strict';

/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var request = require('request');
  var util = require('util');
  var audioRouter = express.Router();

  audioRouter.get('/', function(req, res) {
    let url = req.query.url;

    let audioRequest = request(url);
    req.pipe(audioRequest);
    audioRequest.pipe(res);
  });


  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/audio', require('body-parser').json());
  app.use('/api/audio', audioRouter);
};
