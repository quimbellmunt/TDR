const mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

const Tasques = new mongoose.Schema({
	nom: String,
	preu: String,
	temps: String,
	descripcio: String
});



module.exports = mongoose.model('Tasques', Tasques);