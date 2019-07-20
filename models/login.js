const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Login = new mongoose.Schema({
 username: String,
 password: String,
});

// User.plugin(passportLocalMongoose); 
Login.plugin(passportLocalMongoose); // si li canvies el nom al model també l'has de canviar aquí

//Hi ha hagut un problema perquè quan m'he registrat ara, a la meva terminal m'han aparegut totes les dades però també la contrasenya sense encriptar
module.exports = mongoose.model('Login', Login);