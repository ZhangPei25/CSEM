'use strict';
const express = require('express');
const router = express.Router();

module.exports = function(modelname) {
    router.post('/', modelName.create),

        router.get('/:id', modelName.get),

        router.put('/:id', modelName.update),

        router.delete('/:id', modelName.delete)
}