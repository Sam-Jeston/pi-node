'use strict';

// Declare required middleware and files as constants
const express = require('express');
const app = express();
const expRouter = express.Router();
const routes = require('./routes.js');
const scraper = require('./scraper.js')

// Start scrape of weather data
scraper.startScrape();

// Define routes with the express Router
expRouter.get('/daily', routes.get_daily)

// Use the express router to mout all routes defined with expRouter
app.use(expRouter);

// Boot the server on port 3000
app.listen('3000')
console.log('Server booted on Port 3000')