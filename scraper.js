'use strict';

const request = require('request');
const cheerio = require('cheerio');
const db = require('./data.js');

var scrape = function() {
  let url = 'http://www.weatherzone.com.au/';
  let json = {};
  let current = {};

  request(url, function(error, response, html){
    if(error) {
      console.log(error);
      return;
    }

    let $ = cheerio.load(html);

    $('table.capital-cities').filter(function() {
      var data = $(this);

      const cities = ['Brisbane', 'Sydney', 'Canberra', 'Melbourne', 'Hobart', 'Darwin', 'Adelaide', 'Perth']

      cities.forEach(cit => {
        let current_city = data.find('a:contains(\'' + cit + '\')');
        json[cit] = current_city.parent().parent().find('.now').text();
        current[cit] = current_city.parent().parent().next('tr').find('.location-name').children().html();
      })

      db.recordTemp(json);
      exports.currentConditions = current; 
      console.log('Weather scrape completed');
    })
  })
};

// Scrape immediately on boot and then every 30 minutes
exports.startScrape = function() {
  scrape();
}

// Defind null for currentConditions until it is redefined
exports.currentConditions = {};
