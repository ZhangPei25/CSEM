'use strict';

const owner = require('../models/mongodb/owner');

function create(req, res) {
    modelNmae.create(req.body, (err, result) => {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err);
        }
    });
}

function get(req, res) {
    modelNmae.get({ _id: req.params.id }, (err, result) => {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err);
        }
    });
}

function update(req, res) {
    modelNmae.updateById(req.params.id, req.body, (err, result) => {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err);
        }
    });
}

function delete(req, res) {
    modelNmae.removeById({ _id: req.params.id }, (err, result) => {
        if (!err) {
            return res.json(result);
        } else {
            return reset.send(err);
        }
    });
}