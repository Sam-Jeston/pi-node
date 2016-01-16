'use strict';

const fs = require('fs');
const file = 'data.db';
const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();
var exists = fs.existsSync(file);

var createStatment = 'CREATE TABLE `weather` (`id` INTEGER PRIMARY KEY,`brisbane` INTEGER,`sydney` INTEGER, '+
'`melbourne` INTEGER,`hobart` INTEGER,`canberra` INTEGER,`darwin` INTEGER, '+
'`adelaide` INTEGER,`perth` INTEGER,`date` BLOB);'

// Define new instantion of sqlite3 connection. If it fails to open, retry
// until it is available
var newDb = function(callback) {
  try {
    var db = new sqlite3.Database(file);
    return callback(null, db);
  } catch (err) {
    callback(err, null);
  }
}

// If the db does not exist, create it
if(!exists) {
  console.log('Creating DB file.');
  fs.openSync(file, 'w');

  newDb(function(err, db) {
    if(err) {
      console.log(err);
      return;
    }

    db.run(createStatment);
  })
}

exports.record_temp = function(cityTemps) {
  newDb(function(err, db) {
    if(err) {
      console.log(err);
      return;
    }

    let stmt ='INSERT INTO weather (brisbane, sydney, melbourne, hobart, ' +
    'canberra, darwin, adelaide, perth, date) ' +
    'VALUES (?,?,?,?,?,?,?,?,?)';

    let params = [
      cityTemps.Brisbane,
      cityTemps.Sydney,
      cityTemps.Melbourne,
      cityTemps.Hobart,
      cityTemps.Canberra,
      cityTemps.Darwin,
      cityTemps.Adelaide,
      cityTemps.Perth,
      new Date()
    ]

    db.run(stmt, params, function(err, succ){
      if (err) console.log(err);
      console.log('Weather entry created - db connection closed');
      db.close();
    })
  });
};

// At intervals of 30 minutes, daily temp is the last 48 database entries
exports.daily_temp = function(callback) {
  newDb(function(err, db) {
    if (err) {
      callback(err, null);
      return;
    }

    let stmt = 'select * from weather order by id desc limit 48';
    db.all(stmt, [], function(getErr, rows) {
      if (getErr) {
        callback(getErr, null);
        return;
      }

      callback(null, rows);
      db.close();
      console.log('Daily weather entries retrieved - db connection closed');
    })
  });
};

// At intervals of 30 minutes, weekly temp is the last 336 database entries
exports.weekly_temp = function(callback) {
  newDb(function(err, db) {
    if (err) {
      callback(err, null);
      return;
    }

    let stmt = 'select * from weather order by id desc limit 336';
    db.all(stmt, [], function(err, rows) {
      if (err) {
        callback(err, null);
      }

      callback(null, rows);
      db.close();
      console.log('Weekly weather entries retrieved - db connection closed');
    })
  });
};

// At intervals of 30 minutes, last 30 days temp is the last 1440 database entries
exports.monthly_temp = function(callback) {
  newDb(function(err, db) {
    if (err) {
      callback(err, null);
      return;
    }

    let stmt = 'select * from weather order by id desc limit 1440';
    db.all(stmt, [], function(err, rows) {
      if (err) {
        callback(err, null);
      }

      callback(null, rows);
      db.close();
      console.log('Monthly weather entries retrieved - db connection closed');
    })
  });
};
