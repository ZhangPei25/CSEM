'use strict';

const express = require('express');
const router = express.Router();

if (global.dbType && global.dbType.toLowerCase() == 'postgres') {
	
	const pg = require('pg');
	const sequelize = require('sequelize');

	let owners = global.db.define('owners',{
		name: {
			type: sequelize.STRING
		}
	},{
			timestamps: false 
	});

	router.get('/:id',(req, res) => {
      owners.findById(req.params.id).then(data =>{
				res.send(data);
			}).catch(err => {
				res.send(err);
			});
	});
	router.get('/',(req, res) => {
      owners.findAll().then(data =>{
				res.send(data);
			}).catch(err => {
				res.send(err);
			});
	});

	router.post('/', function(req, res) {
		let ownerName = req.body.name;

		owners.create({name: ownerName}).then( data => {
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
	let ownerSchema = new Schema({
		name: String
	});

	let OwnerModel = conn.model('OwnerModel',ownerSchema);

	router.get('/:id', (req, res) => {
		OwnerModel.findOne({_id:req.params.id},function (err, owners) {
			if (err) {
				console.log(err);
				res.status(400).send('Whoops. An error occured.');
			} else {
				res.send(owners);
			}});
	});

	router.get('/', (req, res) => {
		OwnerModel.find((err,owner) =>{	
		if (err) {
				console.log(err);
				res.status(400).send('Whoops. An error occured.');
			} else {
				res.send(owner);
			}});
	});

	router.post('/', (req, res) => { 
		let newowner = new OwnerModel(req.body);
		newowner.save((err,newowner) => {
			if (err) { 
				console.log(err); 
				res.status(400).send(err);
			} else { 
				res.json(newowner);
			} 
		});
	});

	router.put('/',(req, res) =>{
		OwnerModel.findById(req.body.id, (err,owner) =>{
			if (err) {
				res.send(err);
			} else {
				owner.name = req.body.name;
					owner.save( (err,owner) => {
						if (err) {
							res.send(err);
						} else {
							res.send(owner);
						}
					})
			}
		})
	});
}
module.exports = router;
