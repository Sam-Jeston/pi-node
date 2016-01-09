'use strict';

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

exports.scrape = function(req, res) {
  let url = 'http://www.weatherzone.com.au/';
  let json = {}

  request(url, function(error, response, html){
    if(!error) {
      var $ = cheerio.load(html);
    }

    $('table.capital-cities').filter(function() {
      var data = $(this);

      const cities = ['Brisbane', 'Sydney', 'Canberra', 'Melbourne', 'Hobart', 'Darwin', 'Adelaide', 'Perth']

      // Fat arrow ES2015 sytax. Not sure why ${} string concat wasnt working
      cities.forEach(cit => {
        let current_city = data.find('a:contains(\'' + cit + '\')');
        json[cit] = current_city.parent().parent().find('.now').text();
      })

      res.send(json);
    })
  })
};