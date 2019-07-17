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


mongoose.connect('mongodb://localhost:27017/TdR');

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


const User = require('./models/user');
const Tasques = require('./models/tasques');


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
    console.log()
    res.render('home');
});

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







