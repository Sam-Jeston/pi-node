'use strict';

// Declare required middleware and files as constants
const express = require('express');
const app = express();
const expRouter = express.Router();
const routes = require('./routes.js');
const scraper = require('./scraper.js')
const CronJob = require('cron').CronJob;

// Start scrape of weather data
new CronJob('0,30 * * * *', function() {
    console.log('Weather scrape cron job started');
    scraper.startScrape();
}, null, true, 'Australia/Brisbane');

// Define routes with the express Router
expRouter.get('/api/daily', routes.get_daily);
expRouter.get('/api/weekly', routes.get_weekly);
expRouter.get('/api/monthly', routes.get_monthly);

// Use the express router to mout all routes defined with expRouter
app.use(expRouter);

// Boot the server on port 3000
app.listen('3000')
console.log('Server booted on Port 3000')
