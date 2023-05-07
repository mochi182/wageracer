'use strict';

let model = require('../models/appModel.js');

exports.index = async function (req, res) {
    try {
        res.render('index', {data: await model.select_all()})
    } catch(err) {
        res.json({"Error": err})
    }
};