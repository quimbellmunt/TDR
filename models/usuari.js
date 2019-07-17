const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var autoIncrement = require('mongoose-auto-increment');


const Usuari = new mongoose.Schema({
userId: Number,
username: String, //(same same than USER model)
nom :String,
cognoms:String,
mail: String,
diners : Number
});

//User.plugin(passportLocalMongoose);
// Usuari.plugin(autoIncrement.plugin, { model: 'Usuari', field: 'userId' });

module.exports = mongoose.model('Usuari', Usuari);