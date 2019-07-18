const mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

const Transaccio = new mongoose.Schema({
	usuariOrigen: String,
	usuariReceptor: String,
	tasca: String,
});

var acceptada = true({  
//Aquí teòricament si s'ha acceptat després de l'email, s'ha d'estar pendent de si la següent variable és true o false,
// però ja veig que no es pot posar una varriable dintre d'una altre, el que passa és que no sé com fer-ho.   


});


var acabada = true;
//(Poder posar a la web que l'has acabat o si l'has cancelat)

var acabada = !false;
// En el cas de cancelada s'envia mail (The Nodemailer module) a usuariOrigen per dir que s'ha cancelat. 

var acceptada = false({
 // Aquí s'hauria d'enviar un mail a la persona que ha enviat la tasca per comunicar que no ha estat acceptada. (inclou The Nodemailer module)


});





module.exports = mongoose.model('Transaccio', Transaccio);