var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");//
var bodyParser = require("body-parser");

//Quan al llarg de tot aquest codi apareix la paraula "user" i no "users", això és que he d'afegir la s o que és un tema que va més enllà del nom que li hagi posat a la meva variable?
// Com fer perquè qualsevol d'aquests botons funcioni només si es té la última versió? És possible que hagis de fer get de la última versió i de la que té l'usuari i aleshores ho compares?
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


const User = require('./models/users');


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
      res.render('index', { });
  });

  app.post('/register', function(req, res) {

    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            return res.render('index', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
          res.render('home');
        });
    });
  });

  app.get('/login', function(req, res) {

      res.render('index', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
      res.render('home');
  });

  

  app.post('/logout', function(req, res) {
      req.logout();
      res.render('index');
  });


  app.get('/home', function(req, res){
      res.render('home');
  });


app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});

app.post('/create', function(req, res) {
  tasques.register(new tasques({nom: req.body.nom, preu: req.body.preu, temps: req.body.temps, descripcio: req.body.descripcio}), function(err,tasques)
  {if (err) 
  console.log(err) 

  res.render('tasques')
  });
});
//Aquest botó de create està bé? O la part de new tasques no ho està?

app.post('/modificacio', function(req,res) {
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

app.post('/cancelarTasques', function(res) {
  res.render('home')
});
  

app.post('/deleteTasques', function(req,res) {
  req.delete();
  res.render('home');
});

app.post('/descarrega', function(req,res) {
  //En el req no en tinc ni la menor idea de que he de posar exactament. Sé que al final hem dit que s'enviava la tasca per mail i aleshores té a veure amb The Nodemailer module. 
  res.render('home');
  });

app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});