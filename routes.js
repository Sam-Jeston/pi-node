'use strict';

const db = require('./data.js');

exports.get_daily = function(req, res) {
  db.daily_temp(function(err, success) {
    if(err) console.log(err);
    if(success) {
      res.send(success)
    }
  })
};