var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");



var passportLocalMongoose = require("passport-local-mongoose");
var autoIncrement   = require('mongoose-auto-increment');

var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// var connection = mongoose.createConnection("mongodb://localhost:27017/TdR");
mongoose.connect('mongodb://localhost:27017/TdR');
// autoIncrement.initialize(connection);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


const Usuari = require('./models/usuari');
const Trans = require('./models/trans');
const User = require('./models/user');
const Tasques = require('./models/tasques');



passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.get('/', function (req, res) {
  res.render('index', { user : req.user });
});

app.get('/home', function (req, res) {
  console.log(req.user)
  res.render('home', { user : req.user });
});

app.get('/register', function(req, res) {
    res.render('index', { });
});

// app.post('/register', function(req, res) {

//   User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
//       if (err) {
//           return res.render('index', { user : user });
//       }

//       passport.authenticate('local')(req, res, function () {
//         res.render('home');
//       });
//   });
// });

app.post('/register', function(req, res) {
  console.log('as')
  User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
    console.log('aqui')
    if (err) {
        return res.render('index');
    }
    else {
      // console.log(user)
    console.log('aqui2')
      passport.authenticate('local')(req, res, function () {
        Usuari.create(new Usuari({username:req.body.username}),function(err, Usuari) {
          console.log(Usuari)
          console.log('aqui3')
          if (err) {
            console.log(err)
            res.render('index');
            }
          res.render('home', {user: req.body.username, tasks:null});
        });   
      });
    }
  });
});


// app.get('/login', function(req, res) {
//     res.render('index', { user : req.user });
// });

app.get('/login', function(req, res) {
  Usuari.find({username:req.user},function(err, user) {
    console.log(user[0]) //→ aqui extreus tota la info del usuari inclòs el seu ID
    if (err) {
      console.log(err)
      res.render('login');
    }
    else {
        user = user[0]
        Trans.find ({Receptor: user.id}, function(err, tasks){
        res.render('home', {user:user[0], tasks:tasks});
      });     
    }     
  });   
});

// app.post('/login', passport.authenticate('local'), function(req, res) {
//     console.log()
//     res.render('home');
// });

app.post('/login', passport.authenticate('local'), function(req, res) {
  Usuari.find({username:req.body.username},function(err, user) {
    console.log(user) //→ aqui extreus tota la info del usuari inclòs el seu ID
    if (err) {
      console.log(err)
      res.render('login');
    }
    else {
        Trans.find ({Receptor: user.id}, function(err, tasks){
        res.render('home', {user:user[0], tasks:tasks});
      });     
    }     
  });   
});

app.post('/modificaUsuari', function(req, res){
  console.log('Aqui')
  console.log(req.body)

  Usuari.findOneAndUpdate({username:req.body.username}, {username:req.body.username,
    nom:req.body.nom,
    cognoms:req.body.cognoms,
    diners: req.body.diners,
    mail:req.body.mail}, 
    function(err, user){
      if(err) {
        console.log(err)
      } else {
        Trans.find ({Receptor: user.id}, function(err, tasks){
            console.log(user)
            console.log(tasks)
            res.render('home', {user, user, tasks:tasks});
        });     
      }
    })
})
app.post('/tasques', function(req, res) {
    Tasques.create(new Tasques({Nom : req.body.Nom,Descripcio: req.body.Descripcio,Preu: req.body.Preu,Temps: req.body.Temps}),function(err, Tasca) {
        if (err) {
          console.log(err)
          res.render('home');
          }
        res.render('home');
      });    
});





app.post('/logout', function(req, res) {
    req.logout();
    res.render('index');
});

app.get('/tasques', function(req, res){
    Tasques.find({},function(err, tasks){
      console.log(tasks)
      if(err) console.log(err)
      res.render('tasques',{tasks:tasks}); 
    })
    
});


app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});







