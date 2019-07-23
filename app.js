var express = require("express");
var session = require('express-session');
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");//
var bodyParser = require("body-parser");

//Quan al llarg de tot aquest codi apareix la paraula "user" i no "users", això és que he d'afegir la s o que és un tema que va més enllà del nom que li hagi posat a la meva variable?
///////// depen, de que busques als models. si despres d'un Find tens err, users doncs tindras S si tens err, user no tindras S
// Com fer perquè qualsevol d'aquests botons funcioni només si es té la última versió? És possible que hagis de fer get de la última versió i de la que té l'usuari i aleshores ho compares?
var passportLocalMongoose = require("passport-local-mongoose");
var autoIncrement   = require('mongoose-auto-increment');

var path = require('path');
var express = require('express');
var http = require('http');
var LocalStrategy = require('passport-local').Strategy;
app.use(express.static(__dirname + '/public'));

var app = express();
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))


mongoose.connect('mongodb://localhost:27017/Treball');

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


const Login = require('./models/login'); // aqui estas volent fer servir Login no USER  
//He modificat el codi perque puguis utilitzar el Login com base de dades de Passport Andrea: okay perfecte
const Tasques = require('./models/tasques');
const Transaccio = require('./models/transaccions');
const Users = require('./models/users');


passport.use(new LocalStrategy(Login.authenticate()));

passport.serializeUser(Login.serializeUser());
passport.deserializeUser(Login.deserializeUser());



// obrir la pagina d'inici index.ejs
app.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

// obrir la pagina registre index.ejs
app.get('/register', function(req, res) {
    res.render('index', {tasques : null});
});

// Usuari introdeix les dades del registre en la pagina index.ejs
app.post('/register', function(req, res) {
  console.log(req.body)
  Login.register(new Login({ username : req.body.username }), req.body.password, function(err, user) {
      if (err) {
          console.log(err)
          return res.render('index');
      }
      passport.authenticate('local')(req, res, function () {
        res.render('home',{tasques : null});
      });
  });
});

//localhost:3000/login es igual a localhost:3000 e igual a localhost:3000/registre
app.get('/login', function(req, res) {

    res.render('index', {tasques : []});
});


//Usuari introdueix les dades del seu login a index.ejs   //quan he entrar a home, a dalt posa localhost:3000/login... Això és per culpa del següent o perquè?
app.post('/login', passport.authenticate('local'), function(req, res) {
    res.render('home',{tasques : []});
});


// usuari surt de la plataforma--> aquest controlador es el boto logout de les pagines ejs
app.post('/logout', function(req, res) {
    req.logout();
    res.render('index');
});

// obrir pagina localhost:3000/home --> home.ejs
app.get('/home', function(req, res){
    res.render('home',{tasques:null});
});




//Usuari crea una nova tasca per la llista
app.post('/create', function(req, res) {
  //Avui has de crear un parell de tasques Andrea: no puc accedir a la pàgina de tasques
  console.log(req.body)
  var createdTask = new Tasques({nomTasca: req.body.nomTasca, preu: req.body.preu, temps: req.body.temps, descripcio: req.body.descripcio});
  Tasques.create(createdTask, function(err, createdTask){
    if (err) console.log(err) 
    else {
      console.log('created task', createdTask)
      res.render('tasques', {tasques : createdTask})
    }
  })
});
//Aquest botó de create està bé? O la part de new tasques no ho està?


//Ususari modifica la seva informacio personal
app.post('/modificacio', function(req,res) {
  // avui fes la info del usuari 
  console.log(req.body)
  usuari.findOneAndUpdate({nomUsuari:req.body.nomUsuari, cognoms:req.body.cognoms, username:req.body.username, mail:req.body.mail}, 
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
app.post('/esborrarTasca', function(req,res) {
  console.log(req.body)
  Tasques.findOneAndDelete({nomTasca:req.body.nomTasca}, function(err, tascaEsborrada){
    if(err) { 
      console.log(err) 
    } else {
      Tasques.find({},function(err, tasques){
        if(err) console.log(err)
        res.render('tasques',{tasques : tasques}) 
      })
    }
  })
  
      
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
  //   if(err) {
    
  //     console.log(err)
  //   } else {
  //     console.log('Transacció afegida')
  //   }
  // }); 
  //   aqui has de sumar la pasta el que ha fet la tasca i restarli el que va encomanar-la
  //   Usuari.findOneAndUpdate({nom:receptorTasca},{},function(err, done){
  //   Users.findOneAndUpdate({nom:emisorTasca}, {cartera:dinersEmisor -  preuTasca}, 
  //     function(err, update){
  // console.log(err)
  //   } else {
  //     console.log('Usuari actualitzat')
  //   }
  //   })
  //   Users.findOneAndUpdate({nom:receptorTasca}, {cartera:dinersReceptor +  preuTasca}, 
  //     function(err, update){
  // console.log(err)
  //   } else {
  //     console.log('Usuari actualitzat')
  //   }
  //   })

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


app.post('/descarrega', function(req,res) {
  //En el req no en tinc ni la menor idea de que he de posar exactament. Sé que al final hem dit que s'enviava la tasca per mail i aleshores té a veure amb The Nodemailer module. 
  res.render('home');
  });

app.get('/inici', function(req,res) {
      res.render('home')
    });

app.get('/actualitzacio', function(req,res) {
      res.render('home') //Tot i així, aquí falta que es pugui connectar amb la meitat de la pàgina de home 
    });

app.get('/informacio', function(req,res) {
      res.render('home') //falta també poder accedir a la meitat per trobar-se primer amb informació 
    });

app.get('/usuari', function(req,res) {
      res.render('usuari')
    });

app.get('/modificacioUsuari', function(req,res) {
      res.render('usuari') 
    });

app.get('/tasques', function(req,res) {
  Tasques.find({}, function(error, tasksToShow) {
    console.log(tasksToShow)
    res.render('tasques', {tasques: tasksToShow})
  });
});

app.get('/creacioTasca', function(req,res) {
  Tasques.find({},function(err, tasques){
    if(err) console.log(err)
    res.render('tasques',{tasques : tasques}) 
  })
      
});

app.get('/modificacioTasca', function(req,res) {
      res.render('tasques')  //falta
    });

app.get('/eliminacioTasca', function(req,res) {
      res.render('tasques')//falta
    });

// codi que fa que el servidor s'aixequi
app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});

//Andrea: Aquí hi havia diferents coses que sortien de color rosa:
// - abans del app descarregar hi havia un <<<<<<<HOME però em posava que no es podia llençar app amb unexpected token <<
// - abans de codi que fa que el servidor s¡aixequi hi havia ========= però tampoc em deixava 
// - després de ====== hi havia >>>>>>>d4ec5a9ad6743a1a2473aa51b0f086d63d9a6d74 però tampoc reconeixia res d'això. 