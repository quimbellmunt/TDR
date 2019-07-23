const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Users = new mongoose.Schema({
	nomUsuari: String,
	cognoms: String,
	username: String,
	mail: String, 
	password: String, 
	moneder: Number, // Aqui et falta la pasta que té cada usuari
	identificadorUsuari: Number
});

module.exports = mongoose.model('Users', Users);

//També he tingut problemes amb users no definit i he hagut de borrar les parts que ho incloien