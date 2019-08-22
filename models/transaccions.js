const mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

const Transaccio = new mongoose.Schema({
	tipus: String, // Aqui pot incloure si es creacio de tasca, tasca acceptada, tasca rebutjada, tasca acabada
	usuariOrigen: String,
	usuariReceptor: String, // si el tipus es creacio de tasca aqui li poses null
	tasca: String,
	preu: Number, //la pregunta és com es sap quin preu és. No hauria de tenir una connexió amb la variable de tasques?
	rebutjada: Boolean,
	acabada: Boolean,
	identificadorTrans: Number
});



module.exports = mongoose.model('Transaccio', Transaccio);