'use strict';

const express = require('express');
const router = express.Router();
const ownerModel = require('./owner.js');		
const ProductModel = require('./product.js');		

if (global.dbType && global.dbType.toLowerCase() == 'postgres') {

  const pg = require('pg');
  const sequelize = require('sequelize');
	const conn = global.db;
	
  let shops = global.db.define('shops',{
		owner_id: {
			type: sequelize.STRING 
		},
		name: {
      type: sequelize.STRING
    }
  },{
      timestamps: false
  });

  router.get('/:id',(req, res) => {
      shops.findById(req.params.id).then(data => {
        res.send(data);
      }).catch(err => {
        res.send(err);
      });
  });

  router.get('/',(req, res) => {
      shops.findAll().then(data => {
        res.send(data);
      }).catch(err => {
        res.send(err);
      });
  });

  router.post('/', function(req, res) {
    let shopName = req.body.name;

		ownerModel.findById().then(data => {
			let shopId = data.id;
		}).catch(err =>{
			console.log(err);
		})

    shops.create({owner_id: shopId, name: shopName}).then( data =>{
      res.send(data);
    }).catch(err => {
      res.send(err);
    })
  });

} else if (global.dbType && global.dbType.toLowerCase() == 'mongodb') {	
		
	const mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
	//mongoose.connection = global.db;
	const conn = global.db;

	let Schema = mongoose.Schema;
	let shopSchema = new Schema({
		ownerID: String, 
		name: String,
	});

	let shopModel = conn.model('shopModel',shopSchema);

	router.get('/:id', (req, res) => {
		shopModel.findOne({_id:req.params.id},function (err, shop) {
			if (err) {
				console.log(err);
				res.status(400).send('Whoops. An error occured.');
			} else {
				res.send(shop);
			}});
	});


	router.get('/:id/products', (req, res) => {
		shopModel.findOne({_id:req.params.id},function (err, shop) {
			if (err) {
				console.log(err);
				res.status(400).send('Whoops. An error occured.');
			} else {
				var ProductModel = conn.model('ProductModel');
				ProductModel.find({ },(err,product) =>{
					if (product.shop_id === req.params.id) {
						res.send(product);
					}
				})
			}});
	});
	
	router.post('/', (req, res) => { 

		var OwnerModel = conn.model('OwnerModel');	
		var ownerId = OwnerModel.find({},'_id',(err, owners) => {
			if (err) {
				res.send(err);
			} else {
				console.log('length of owner ::', owners.length);
				
				for (var i = 0; i < owners.length; i++) {
					var owner = owners[i];
					console.log('this is id ::', owner._id);

					let shop = new shopModel();
					shop.ownerID = owner._id;
					shop.name = req.body.name;
					
					shop.save((err,shop) => {
						if (err) {
							console.log('err when saving : ', err);
						} else {
						}
					});
				}
			}
		});
		shopModel.find({ },(err,shop) => {
			if (err) {
				res.send(err);
			} else {
				res.json(shop);
			}
		});	
	});	
}

module.exports = router;
