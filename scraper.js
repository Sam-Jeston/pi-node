'use strict';

const request = require('request');
const cheerio = require('cheerio');
const db = require('./data.js');

var scrape = function() {
  let url = 'http://www.weatherzone.com.au/';
  let json = {}

  request(url, function(error, response, html){
    if(error) {
      console.log(error);
      return;
    }

    let $ = cheerio.load(html);

    $('table.capital-cities').filter(function() {
      var data = $(this);

      const cities = ['Brisbane', 'Sydney', 'Canberra', 'Melbourne', 'Hobart', 'Darwin', 'Adelaide', 'Perth']

      // Fat arrow ES2015 sytax. Not sure why ${} string concat wasnt working
      cities.forEach(cit => {
        let current_city = data.find('a:contains(\'' + cit + '\')');
        json[cit] = current_city.parent().parent().find('.now').text();
      })

      db.record_temp(json);
      console.log('Weather scrape completed')
    })
  })
};

// Scrape immediately on boot and then every 30 minutes
exports.startScrape = function() {
  scrape();
}
