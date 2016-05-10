require('dotenv').config();

var request = require('request');
var express = require('express');
var redis = require("redis");
var app = express();
var redisClient = redis.createClient(process.env.REDIS_URL);


app.get('/dribbble', function(req, res) {
  redisClient.get('dribbble', function(err, reply) {
    if(reply) {
      res.json(JSON.parse(reply));
    } else {
      request('https://api.dribbble.com/v1/shots?access_token=' + process.env.DRIBBBLE_CLIENT_KEY, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          redisClient.set('dribbble', body);
          redisClient.expire('dribbble', 60);
          res.json(JSON.parse(body));
        }
      });
    }
  });
});

app.listen(process.env.PORT || 1337);
