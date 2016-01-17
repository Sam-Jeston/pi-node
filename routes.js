'use strict';

const db = require('./data.js');
const scraper = require('./scraper.js');

exports.getDaily = function(req, res) {
  db.dailyTemp(function(err, success) {
    if(err) {
      console.log(err);
      res.send(err);
    }

    if(success) {
      res.send(success);
    }
  })
};

exports.getWeekly = function(req, res) {
  db.weeklyTemp(function(err, success) {
    if(err) {
      console.log(err);
      res.send(err);
    }

    if(success) {
      res.send(success);
    }
  })
};

exports.getMonthly = function(req, res) {
  db.monthlyTemp(function(err, success) {
    if(err) {
      console.log(err);
      res.send(err);
    }
    
    if(success) {
      res.send(success);
    }
  })
};

exports.currentConditions = function(req, res) {
  res.send(scraper.currentConditions);
}