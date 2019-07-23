const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Users = new mongoose.Schema({
	nomUsuari: String,
	cognoms: String,
	username: String,
	mail: String, 
	password: String, 
	moneder: Number,  // Aqui et falta la pasta que té cada usuari
	// epp companya si tot el atributs porten una come al final menys lúltim... si afegeixes has de posar-li coma.
	// tens molt models que son User/Usuari/login... escull que volguis pero esborra un. 
	// identificadorUsuari esta bé pero no li veig lútilitat si ja tens el nomUsuari
	identificadorUsuari: Number
});

module.exports = mongoose.model('Users', Users);

//També he tingut problemes amb users no definit i he hagut de borrar les parts que ho incloien