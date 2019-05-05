'use strict';

const express = require('express');
const router = express.Router();

if (global.dbType && global.dbType.toLowerCase() == 'postgres') {

  const pg = require('pg');
  const sequelize = require('sequelize');

  let product = global.db.define('product',{
    shop_id: {
      type: sequelize.STRING
    },
    name: {
      type: sequelize.STRING
    },
    price: {
      type: sequelize.INTEGER
    }
  },{
      timestamps: false
  });

  router.get('/:id',(req, res) => {
      product.findById(req.params.id).then(data => {
        res.send(data);
      }).catch(err => {
        res.send(err);
      });
  });

  router.get('/',(req, res) => {
      product.findAll().then(data => {
        res.send(data);
      }).catch(err => {
        res.send(err);
      });
  });

  router.post('/', function(req, res) {
		let shopId = req.body.shop_id;
    let productName = req.body.name;
		let productPrice = req.body.price;

    product.create({shop_id: shopId, name: productName, price: productPrice}).then( data =>{
      res.send(data);
    }).catch(err => {
      res.send(err);
    })
  });

} else if (global.dbType && global.dbType.toLowerCase() == 'mongodb') {	
		
	const mongoose = require('mongoose');
	const shopModel = require('./shop.js');

	mongoose.Promise = global.Promise;
//	mongoose.connection = global.db;
	const conn = global.db;

	let Schema = mongoose.Schema;
	let productSchema = new Schema({
		shop_id: String,
		name: String,
		price: Number,
	});

	let ProductModel = conn.model('ProductModel',productSchema);

	router.get('/:id', (req, res) => {
		ProductModel.findOne({_id:req.params.id},function (err, product) {
			if (err) {
				console.log(err);
				res.status(400).send('Whoops. An error occured.');
			} else {
				res.send(product);
			}});
	});

	router.get('/', (req, res) => {
		ProductModel.find({ },function (err, product) {
			if (err) {
				console.log(err);
				res.status(400).send('Whoops. An error occured.');
			} else {
				res.send(product);
			}});
	});

	router.post('/', (req, res) => { 
    
		var shopModel = conn.model('shopModel');

    var shopId = shopModel.find({ },'_id',(err, shops) => {
      if (err) {
        res.send(err);
      } else {
        console.log('length of owner ::', shops.length);

        for (var i = 0; i < shops.length; i++) {
          var shop = shops[i];
          console.log('this is id ::', shop._id);

          let product = new ProductModel();
          product.shop_id = shop._id;
          product.name = req.body.name;
					product.price = req.body.price;

          product.save((err,product) => {
            if (err) {
              console.log('err when saving : ', err);
			       } else {
							
						 }
          });
        }
			}
    });
    
			ProductModel.find({ },(err,product) => {
				if (err) {
					res.send(err);
				} else {
					res.json(product);
				}
			});
	});	
}

module.exports = router;
