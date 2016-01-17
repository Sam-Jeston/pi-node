'use strict';

// Declare required middleware and files as constants
const express = require('express');
const app = express();
const expRouter = express.Router();
const routes = require('./routes.js');
const scraper = require('./scraper.js')

// Start scrape of weather data
// Interval watcher required to keep app active, run once a minute
var wake = function() {
  console.log('app on watch');
};
setInterval(function() { wake(); }, 60000);

var scrapeTimer = function() {
  scraper.startScrape();
}
setInterval(function() { scrapeTimer(); }, 1800000);

// Define routes with the express Router
expRouter.get('/api/daily', routes.getDaily);
expRouter.get('/api/weekly', routes.getWeekly);
expRouter.get('/api/monthly', routes.getMonthly);
expRouter.get('/api/current', routes.currentConditions);

// Allow CORS for dev purposes. Does not effect production
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Use the express router to mount all routes defined with expRouter
app.use(expRouter);

// Boot the server on port 3000
app.listen('3000')
console.log('Server booted on Port 3000')
