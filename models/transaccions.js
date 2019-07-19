const mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

const Transaccio = new mongoose.Schema({
	tipus: String, // Aqui pot incloure si es creacio de tasca, tasca acceptada, tasca rebutjada, tasca acabada
	usuariOrigen: String,
	usuariReceptor: String, // si el tipus es creacio de tasca aqui li poses null
	tasca: String,
});


///// els models nomes tenen la informació que hi ah per sobre dáquesta linea.... tota la resta va al controlador, en el teu as app.js

// var acceptada = true({  
// //Aquí teòricament si s'ha acceptat després de l'email, s'ha d'estar pendent de si la següent variable és true o false,
// // però ja veig que no es pot posar una varriable dintre d'una altre, el que passa és que no sé com fer-ho.   


// });


//var acabada = true;
//(Poder posar a la web que l'has acabat o si l'has cancelat)
// Quim: aixo es part del controlador

//var acabada = !false;
// En el cas de cancelada s'envia mail (The Nodemailer module) a usuariOrigen per dir que s'ha cancelat. 
// Quim: aixo es part del controlador

//var acceptada = false({
 // Aquí s'hauria d'enviar un mail a la persona que ha enviat la tasca per comunicar que no ha estat acceptada. (inclou The Nodemailer module)
// Quim: aixo es part del controlador

//});





module.exports = mongoose.model('Transaccio', Transaccio);