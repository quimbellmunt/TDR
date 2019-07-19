var express = require("express");
//var session = require('express-session'); si us plau instala npm install --save express-session i descomenta aquesta linea
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");//
var bodyParser = require("body-parser");



var passportLocalMongoose = require("passport-local-mongoose");
var autoIncrement   = require('mongoose-auto-increment');

var path = require('path');
var express = require('express');
var http = require('http');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))


mongoose.connect('mongodb://localhost:27017/Treball');

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


const Login = require('./models/login'); // aqui estas volent fer servir Login no USER  
//He modificat el codi perque puguis utilitzar el Login com base de dades de Passport

passport.use(new LocalStrategy(Login.authenticate()));

passport.serializeUser(Login.serializeUser());
passport.deserializeUser(Login.deserializeUser());



// obrir la pagina d'inici index.ejs
app.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

// obrir la pagina registre index.ejs
app.get('/register', function(req, res) {
    res.render('index', { });
});

// Usuari introdeix les dades del registre en la pagina index.ejs
app.post('/register', function(req, res) {
  console.log(req.body)
  Login.register(new Login({ username : req.body.username }), req.body.password, function(err, user) {
      if (err) {
          console.log(err)
          return res.render('index', { user : user });
      }
      passport.authenticate('local')(req, res, function () {
        res.render('home');
      });
  });
});

//localhost:3000/login es igual a localhost:3000 e igual a localhost:3000/registre
app.get('/login', function(req, res) {

    res.render('index', { user : req.user });
});


//Usuari introdueix les dades del seu login a index.ejs
app.post('/login', passport.authenticate('local'), function(req, res) {
    res.render('home');
});


// usuari surt de la plataforma--> aquest controlador es el boto logout de les pagines ejs
app.post('/logout', function(req, res) {
    req.logout();
    res.render('index');
});

// obrir pagina localhost:3000/home --> home.ejs
app.get('/home', function(req, res){
    res.render('home');
});




//Usuari crea una nova tasca per la llista
app.post('/create', function(req, res) {
  //Avui has de crear un parell de tasques
  console.log(req.body)
  tasques.register(new tasques({nom: req.body.nom, preu: req.body.preu, temps: req.body.temps, descripcio: req.body.descripcio}), function(err,tasques)
  {if (err) 
  console.log(err) 

  res.render('tasques')
  });
});


//Ususari modifica la seva informacio personal
app.post('/modificacio', function(req,res) {
  // avui fes la info del usuari
  console.log(req.body)
  usuari.findOneAndUpdate({nom:req.body.nom, cognoms:req.body.cognoms, username:req.body.username, mail:req.body.mail}, 
    function(err,user) {
      if(err) {
        console.log(err)
        
      }else{
        Trans.find({Receptor: user.id}, function(err, tasks){
        res.render('home', {user, user, tasks:tasks});
        }); 
      }    
    })
});


// La Tasca es eborrada de la base de Dades
app.post('/tascaEsborrada', function(req,res) {
  // aqui has mirar les informacions que t'arriben del fron end a req.body.
  // hauries de rebre algo semblant a req.body.nom
  // var nomTasca = req.body.nom
  // aleshores interactues amb el teu model Tasca
  //https://mongoosejs.com/docs/queries.html
  // Tasques.findOneAndDelete({nom:nomTasca}, function(err, tascaEliminada){
    // if(err) {
    // 
    //   console.log(err)
    // } else {
    // res.render('home');
    // }

  //})
  //req.delete();Aixo no fa res
  //res.render('home'); Aixo ha dánar dintre de la tasca d'esborra la tasca
});

//Usuari Receptor acaba la Tasca 

app.post('/TascaAcabada', function(res) {
  // aqui has mirar les informacions que t'arriben del fron end a req.body.
  // hauries de rebre algo semblant a req.body.emisor, req.body.receptor, req.body.tasca i requ.body.preu
  // var emisorTasca = req.body.emisor
  // var receptorTasca = req.body.receptor
  // var dinersReceptor= req.body.dinersReceptor
  // var dinersEmisor = req.body.dinersEmisor
  // var nomTasca = req.body.tasca
  // var preuTasca = req.body.preu
  // aqui interactues amb 3 models, dues vegades amb Usuari i una vegada amb trasaccions
  // Trans.create(new Trans({tipus:'tasca Acabada', usuariOrigen: emisorTasca, }), function(err, tascaEliminada){
    // if(err) {
    // 
    //   console.log(err)
    // } else {
    //   console.log('Transacció afegida')
    // }
  // }); 
    // aqui has de sumar la pasta el que ha fet la tasca i restarli el que va encomanar-la
    // Usuari.findOneAndUpdate({nom:receptorTasca},{},function(err, done){
    // Users.findOneAndUpdate({nom:emisorTasca}, {cartera:dinersEmisor -  preuTasca}, 
    //   function(err, update){
//   console.log(err)
    // } else {
    //   console.log('Usuari actualitzat')
    // }
    // })
    // Users.findOneAndUpdate({nom:receptorTasca}, {cartera:dinersReceptor +  preuTasca}, 
    //   function(err, update){
//   console.log(err)
    // } else {
    //   console.log('Usuari actualitzat')
    // }
    // })

  //})
  res.render('home')
});

//tascaCancelada i tascaRebutjada no es el mateix?

app.post('/tascaCancelada', function(res) {
  res.render('home')
});

app.post('/TascaRebutjada', function(res) {
  //req.body.emisor
  //var acabada = !false;
  // En el cas de cancelada s'envia mail (The Nodemailer module) a usuariOrigen per dir que s'ha cancelat. 
  // Quim: aixo es part del controlador
  res.render('home')
});

//Usuari accepta la tasca

app.post('/TascaAcceptada', function(res) {
  //req.body.emisor
  //var acabada = !false;
  // En el cas de cancelada s'envia mail (The Nodemailer module) a usuariOrigen per dir que s'ha cancelat. 
  // Quim: aixo es part del controlador
  res.render('home')
});

app.get('/ActualitzaFitxer', function(res) {
  console.log(req.body)
  //Aquest es el boto a on l'usuari demana el nou fitxer per mail
});

// codi que fa que el servidor s'aixequi
app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});