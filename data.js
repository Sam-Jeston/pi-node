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

// We are scraping data at 30 minute intervals. To return data for every hour, 
// we will only return ids divisible by 2
exports.daily_temp = function(callback) {
  newDb(function(err, db) {
    if (err) {
      callback(err, null);
      return;
    }

    let stmt = 'select * from weather where id%2 = 0 order by id desc limit 24';
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

// Return entries at 6 entries a day, so 42 entries a week
exports.weekly_temp = function(callback) {
  newDb(function(err, db) {
    if (err) {
      callback(err, null);
      return;
    }

    let stmt = 'select * from weather where id%8 = 0 order by id desc limit 42';
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

// Return entries at 2 entries a day, so 60 entries a month
exports.monthly_temp = function(callback) {
  newDb(function(err, db) {
    if (err) {
      callback(err, null);
      return;
    }

    let stmt = 'select * from weather where id%24 = 0 order by id desc limit 60';
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
