const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Users = new mongoose.Schema({
	nom: String,
	cognoms: String,
	username: String,
	mail: String, 
	password: String, 
	moneder: Number // Aqui et falta la pasta que té cada usuari

});

module.exports = mongoose.model('Users', Users);