const mongoose = require('mongoose');
var ItemSchema= new Schema({
	name: { type:String, required: true, trim: true}
},
{
	timestamps:true
});
// var autoIncrement = require('mongoose-auto-increment');

const Tasques = new mongoose.Schema({
	nomTasca: String,
	preu: String,
	temps: String,
	descripcio: String,
	identificadorTasca: Number
});



module.exports = mongoose.model('Tasques', Tasques);

//Tasques is not defined: error per carregar la pàgina... segurament és un error estúpid però no el sé detectar