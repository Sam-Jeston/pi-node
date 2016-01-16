'use strict';

const db = require('./data.js');

exports.get_daily = function(req, res) {
  db.daily_temp(function(err, success) {
    if(err) {
      console.log(err);
      res.send(err);
    }

    if(success) {
      res.send(success);
    }
  })
};

exports.get_weekly = function(req, res) {
  db.weekly_temp(function(err, success) {
    if(err) {
      console.log(err);
      res.send(err);
    }

    if(success) {
      res.send(success);
    }
  })
};

exports.get_monthly = function(req, res) {
  db.monthly_temp(function(err, success) {
    if(err) {
      console.log(err);
      res.send(err);
    }
    
    if(success) {
      res.send(success);
    }
  })
};