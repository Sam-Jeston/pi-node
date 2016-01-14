'use strict';

const fs = require('fs');
const file = 'data.db';
const moment = require('moment');
var exists = fs.existsSync(file);

var createStatment = 'CREATE TABLE `weather` (`id` INTEGER PRIMARY KEY,`brisbane` INTEGER,`sydney` INTEGER, '+
'`melbourne` INTEGER,`hobart` INTEGER,`canberra` INTEGER,`darwin` INTEGER, '+
'`adelaide` INTEGER,`perth` INTEGER,`date` BLOB);'

if(!exists) {
  console.log('Creating DB file.');
  fs.openSync(file, 'w');
}

const sqlite3 = require('sqlite3').verbose();

exports.record_temp = function(cityTemps) {
  let db = new sqlite3.Database(file);

  db.serialize(function() {
    if(!exists) {
      db.run(createStatment);
    }
    
    let stmt = db.prepare('INSERT INTO weather (brisbane, sydney, melbourne, hobart, ' +
    'canberra, darwin, adelaide, perth, date) ' +
    'VALUES (?,?,?,?,?,?,?,?,?)');

    stmt.run(
      cityTemps.Brisbane,
      cityTemps.Sydney,
      cityTemps.Melbourne,
      cityTemps.Hobart,
      cityTemps.Canberra,
      cityTemps.Darwin,
      cityTemps.Adelaide,
      cityTemps.Perth,
      new Date()
    )
    
    stmt.finalize();
    db.close();
    console.log('Weather entry created - db connection closed');
  });
};

// At intervals of 30 minutes, daily temp is the last 48 database entries
exports.daily_temp = function(callback) {
  let db = new sqlite3.Database(file);

  let stmt = 'select * from weather order by id desc limit 48';
  db.all(stmt, [], function(err, rows) {
    if (err) {
      callback(err, null);
    }

    callback(null, rows);
    db.close();
    console.log('Daily weather entries retrieved - db connection closed');
  })
};

// At intervals of 30 minutes, weekly temp is the last 336 database entries
exports.weekly_temp = function(callback) {
  let db = new sqlite3.Database(file);

  let stmt = 'select * from weather order by id desc limit 336';
  db.all(stmt, [], function(err, rows) {
    if (err) {
      callback(err, null);
    }

    callback(null, rows);
    db.close();
    console.log('Weekly weather entries retrieved - db connection closed');
  })
};

// At intervals of 30 minutes, last 30 days temp is the last 1440 database entries
exports.monthly_temp = function(callback) {
  let db = new sqlite3.Database(file);

  let stmt = 'select * from weather order by id desc limit 1440';
  db.all(stmt, [], function(err, rows) {
    if (err) {
      callback(err, null);
    }

    callback(null, rows);
    db.close();
    console.log('Monthly weather entries retrieved - db connection closed');
  })
};
