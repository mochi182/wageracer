'use strict';

let controller = require('../controllers/appController.js');

exports.routes = function (app) {

    // Create
    app.post('/application', function (req, res) {
        controller.create(req, res);
    });

    // Read All
    app.get('/', function (req, res) {
        controller.readAll(req, res);
    });

    // Read
    app.get('/application/:id', function (req, res) {
        controller.read(req, res);
    });

    // Update
    app.put('/application/:id', function (req, res) {
        controller.update(req, res);
    });

    // Disable
    app.delete('/application/:id', function (req, res) {
        controller.disable(req, res);
    });

    // Default Route
    //app.get('/', function (req, res) {
    //    controller.index(req, res);
    //});

};
