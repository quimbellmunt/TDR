const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');
var autoIncrement = require('mongoose-auto-increment');


const Tasques = new mongoose.Schema({
 taskId: Number,
 preu: String,
 temps: String, 
 descripcio: String,
 titol: String
});

// User.plugin(passportLocalMongoose);
// Tasques.plugin(autoIncrement.plugin, { model: 'Tasques', field: 'taskId' });

module.exports = mongoose.model('Tasques', Tasques);