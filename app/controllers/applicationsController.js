'use strict';

let model = require('../models/applicationsModel.js');

exports.create = async function (req, res) {
    try {
        //await model.create(req.body);
        //res.redirect('/applications');
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.readAll = async function (req, res) {
    try {
        res.render('applications', {applications: await model.readAll()})
    } catch(err) {
        res.json({"Error": err})
    }
};

exports.read = async function (req, res) {
    try {
        //res.render('application', {application: await model.read(req.params.id)});
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.update = async function (req, res) {
    try {
        //await model.update(req.params.id, req.body);
        //res.redirect('/application/' + req.params.id);
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.disable = async function (req, res) {
    try {
        //await model.disable(req.params.id);
        //res.redirect('/applications');
    } catch (err) {
        res.json({"Error": err});
    }
};