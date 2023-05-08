'use strict';

let model = require('../models/projectsModel.js');

exports.create = async function (req, res) {
    try {
        //await model.create(req.body);
        //res.redirect('/projects');
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.readAll = async function (req, res) {
    try {
        res.render('projects', {projects: await model.readAll()})
    } catch(err) {
        res.json({"Error": err})
    }
};

exports.read = async function (req, res) {
    try {
        //res.render('project', {project: await model.read(req.params.id)});
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.update = async function (req, res) {
    try {
        //await model.update(req.params.id, req.body);
        //res.redirect('/project/' + req.params.id);
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.disable = async function (req, res) {
    try {
        //await model.disable(req.params.id);
        //res.redirect('/projects');
    } catch (err) {
        res.json({"Error": err});
    }
};