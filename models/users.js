const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Users = new mongoose.Schema({
	nom: String,
	cognoms: String,
	username: String,
	mail: String, 
	password: String

});

module.exports = mongoose.model('Users', Users);