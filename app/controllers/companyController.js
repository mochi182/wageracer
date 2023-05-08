'use strict';

let model = require('../models/companyModel.js');

exports.create = async function (req, res) {
    try {
        //await model.create(req.body);
        //res.redirect('/companies');
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.readAll = async function (req, res) {
    try {
        res.render('index', {companies: await model.readAll()})
    } catch(err) {
        res.json({"Error": err})
    }
};

exports.read = async function (req, res) {
    try {
        //res.render('company', {company: await model.read(req.params.id)});
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.update = async function (req, res) {
    try {
        //await model.update(req.params.id, req.body);
        //res.redirect('/company/' + req.params.id);
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.disable = async function (req, res) {
    try {
        //await model.disable(req.params.id);
        //res.redirect('/companies');
    } catch (err) {
        res.json({"Error": err});
    }
};