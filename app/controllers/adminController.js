'use strict';

let model = require('../models/adminModel.js');

exports.create = async function (req, res) {
    try {
        await model.create(req);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.readAll = async function (req, res) {
    try {
        res.json(await model.readAll(req))
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.getColumns = async function (req, res) {
    try {
        res.json(await model.getColumns(req))
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.update = async function (req, res) {
    try {
        await model.update(req);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.delete = async function (req, res) {
    try {
        await model.delete(req);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};