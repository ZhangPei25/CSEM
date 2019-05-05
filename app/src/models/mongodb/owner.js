'use strict';

const mongoose = require('mongoose');

const mongooseConn = global.db; // connection 
const Schema = mongoose.Schema;

let ownerSchema = new Schema({
    name: String,
});

ownerSchema.statics = {
    create: function(data, callback) {
        let owner = new ownerModel(data);
        owner.save(callbakc);
    }
}

let owner = mongooseConn.model('owner', ownerSchema);

module.exports = owner; // export owner model