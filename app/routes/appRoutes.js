'use strict';

let controller = require('../controllers/appController.js');

exports.routes = function (app) {
    
    app.get('/', function (req, res) {
        controller.index(req, res);
    });

};