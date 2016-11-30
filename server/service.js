'use strict'

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

// geokey: AIzaSyDweFYmMiZWrMjAE16fq5suQUMrV7JEwG4
// https://maps.googleapis.com/maps/api/geocode/json?address=berlin&key=AIzaSyDweFYmMiZWrMjAE16fq5suQUMrV7JEwG4

// Time zone key: AIzaSyAC8UfkEFgOG-MHAZ4yA3L18nakUqP9zhs
//https://maps.googleapis.com/maps/api/timezone/json?location=38.908133,-77.047119&timestamp=1458000000&key=YOUR_API_KEY


// Colon defines a request parameter
service.get('/service/:location', (req, res, next) => {

    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=AIzaSyDweFYmMiZWrMjAE16fq5suQUMrV7JEwG4', (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        const location = response.body.results[0].geometry.location;
        const timestamp = +moment().format('X');

        request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=AIzaSyAC8UfkEFgOG-MHAZ4yA3L18nakUqP9zhs', (err, response) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            const result = response.body;
            const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

            res.json({result: timeString});
        });
    });
});

module.exports = service;