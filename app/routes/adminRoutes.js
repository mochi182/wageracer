'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController.js');

// Create
router.post('/', (req, res) => {
    controller.create(req, res);
});

// Read all
router.get('/', (req, res) => {
    controller.readAll(req, res);
});

// Read all
router.get('/get_columns', (req, res) => {
    controller.getColumns(req, res);
});

// Update
router.put('/:id', (req, res) => {
    controller.update(req, res);
});

// Disable
router.delete('/:id', (req, res) => {
    controller.delete(req, res);
});

module.exports = router