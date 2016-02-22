'use strict';

const parser = require('feed-reader');

/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var feedRouter = express.Router();

  feedRouter.get('/', function(req, res) {
    let url = req.query.url;

    try {
    parser.parse(url).then((feed)=>{
      res.send(feed);
    })
    .catch(err => {
      console.log(`mock error:${err}`);
      res.sendStatus(500);
      return;
    })
  } catch(err){
    console.log('err', err);
  }


  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/feed', require('body-parser').json());
  app.use('/api/feed', feedRouter);
};
