const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');
// var autoIncrement = require('mongoose-auto-increment');


const Tasques = new mongoose.Schema({
 Nom: String,
 Preu: String,
 Temps: String, 
 Descripcio: String
});

// User.plugin(passportLocalMongoose);

module.exports = mongoose.model('Tasques', Tasques);