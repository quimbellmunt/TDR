const mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

const Transaccio = new mongoose.Schema({
	usuariOrigen: String,
	usuariReceptor: String,
	tasca: String,
});



module.exports = mongoose.model('Transaccio', Transaccio);