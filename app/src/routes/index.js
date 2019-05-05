'use strict';

const express = require('express');
const router = express.Router();

if (global.dbType && global.dbType.toLowerCase() == 'postgres') {
	const pg = require('pg');
	const sequelize = require('sequelize');
	const conn = global.db;
	

} else if (global.dbType && global.dbType.toLowerCase() == 'mongodb') {	
	
	const mongoose = require('mongoose');
	const owner = require('./owner.js');
	const shop = require('./shop.js');
	const product = require('./product.js');
	mongoose.Promise = global.Promise;
	//mongoose.connection = global.db;
	const conn = global.db;


	router.get('/shop/:id/products', (req, res) => {
		var shop = conn.model('shopModel');
		var product = conn.model('ProductModel');
		console.log(req.params.id);		
		product.findOne({shop_id: req.params.id}, (err, product) => { 
			if (err) {
				res.send(err);
			} else {
				res.send(product);
			}
		});


	});
}

module.exports = router;
