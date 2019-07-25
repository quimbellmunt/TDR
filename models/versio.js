const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Versio = new mongoose.Schema({
	//teòricament aquesta variable és el conjunt de tots els documents i probablement no la necessito, per tant estic només presentant la idea com a tal, sense definir-la
	//la raó per la qual l'he creat és per a home, poder mostrar el nom de la versió en el home quan l'has de descarregar
	numeroVer: Number,
});

module.exports = mongoose.model('Versio', Versio);

