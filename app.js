var express = require("express");
var session = require('express-session');
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
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(session({secret: 'TdR',saveUninitialized: true,resave: true}));

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
const Block = require('./models/block');


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.get('/', function (req, res) {
  if('passport' in req.session){
    Usuari.find({username:req.session.passport.user},function(err, user) {
      console.log(user) //→ aqui extreus tota la info del usuari inclòs el seu ID
      if (err) {
        console.log(err)
        res.render('login');
      }
      else {
        console.log(user)
          Trans.find ({Receptor: user[0].nom}, function(err, tasks){
          res.render('home', {user:user[0], tasks:tasks});
        });     
      }     
    });
  }
  else {
    res.render('index', { user : req.user });
  }
});

app.get('/login', function(req, res) {
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Usuari.find({username:req.user},function(err, user) {
      console.log(user[0]) //→ aqui extreus tota la info del usuari inclòs el seu ID
      if (err) {
        console.log(err)
        res.render('login');
      }
      else {
          console.log(user[0])
          user = user[0]
          Trans.find ({Receptor: user[0].nom}, function(err, tasks){
            console.log(tasks)
          res.render('home', {user:user[0], tasks:tasks});
        });     
      }     
    }); 
  }  
});

app.get('/register', function(req, res) {
    res.render('index', { });
});

app.get('/home', function (req, res) {
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Usuari.find({username:req.session.passport.user},function(err, user) {
      console.log(user) //→ aqui extreus tota la info del usuari inclòs el seu ID
      if (err) {
        console.log(err)
        res.render('login');
      }
      else {
        console.log(user)
          Trans.find({Receptor: user[0].nom}, function(err, tasks){
            console.log(tasks)
          res.render('home', {user:user[0], tasks:tasks});
        });     
      }     
    });
  }  
});


app.get('/tasques', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Tasques.find({},function(err, tasks){
      console.log(tasks)
      if(err) console.log(err)
      res.render('tasques',{tasks:tasks}); 
    })
  }
});

app.get('/tasques', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Tasques.find({},function(err, tasks){
      console.log(tasks)
      if(err) console.log(err)
      res.render('tasques',{tasks:tasks}); 
    })
   } 
});

// app.get('/tasques', function(req, res){
//     Tasques.find({},function(err, tasks){
//       console.log(tasks)
//       if(err) console.log(err)
//       res.render('tasques',{tasks:tasks}); 
//     })
    
// });

app.get('/transaccio', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Usuari.find({}, 
    function(err, users){
      if(err) {
        console.log(err)
      } else {
        Tasques.find ({}, 
          function(err, tasks){
            console.log(users)
            console.log(tasks)
            res.render('trans', {message: null, emisor:req.session.passport.user, users: users, tasks:tasks});
        });     
      }
    })
  } 
});

app.get('/creacioTrans', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Usuari.find({}, 
    function(err, users){
      if(err) {
        console.log(err)
      } else {
        Tasques.find ({}, 
          function(err, tasks){
            console.log(users)
            console.log(tasks)
            res.render('trans', {message: null, emisor:req.session.passport.user, users: users, tasks:tasks});
        });     
      }
    })
  }  
});


app.post('/register', function(req, res) {
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
      console.log('aqui')
      if (err) {
          return res.render('index');
      }
      else {
      console.log('aqui2')
        passport.authenticate('local')(req, res, function () {
          Usuari.create(new Usuari({username:req.body.username, diners: 20}),function(err, userCreated) {
            console.log(userCreated)
            console.log('aqui3')
            if (err) {
              console.log(err)
              res.render('index');
              }
            user['username'] = userCreated.username
            user['diners'] = userCreated.diners
            res.render('home', {user: user, tasks : []});
          });   
        });
      }
    });
  }
});





app.post('/login', passport.authenticate('local'), function(req, res) {
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Usuari.find({username:req.body.username},function(err, user) {
      console.log(user) //→ aqui extreus tota la info del usuari inclòs el seu ID
      if (err) {
        console.log(err)
        res.render('login');
      }
      else {
          console.log(user[0])
          Trans.find ({Receptor: user[0].nom}, function(err, tasks){
          res.render('home', {user:user[0], tasks:tasks});
        });     
      }     
    }); 
  }  
});

app.post('/modificaUsuari', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Usuari.findOneAndUpdate({username:req.body.username}, {username:req.body.username,
      nom:req.body.nom,
      cognoms:req.body.cognoms,
      mail:req.body.mail}, 
    function(err, user){
      if(err) {
        console.log(err)
      } else {
        Usuari.find({username:req.body.username}, function(err, userUpdated){
          if(err){
            console.log(err)
          }else{
            Trans.find({Receptor: user.nom}, function(err, tasks){
            console.log(userUpdated)
            console.log(tasks)
            res.render('home', {userUpdated, tasks : tasks});
        });    
          }
        })
         
      }
    })
  }
})
app.post('/tasques', function(req, res) {
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Tasques.create(new Tasques({Nom : req.body.Nom,Descripcio: req.body.Descripcio,Preu: req.body.Preu,Temps: req.body.Temps}),function(err, Tasca) {
      if (err) {
        console.log(err)
        res.render('home');
        }
      res.render('home');
    });
  }    
});







app.post('/logout', function(req, res) {
    req.logout();
    res.render('index');
});



app.post('/creacioTasca', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    console.log(req.body)
    Tasques.create(new Tasques(
      {
        preu: req.body.preu,
        temps: req.body.temps,
        descripcio: req.body.descripcio,
        titol: req.body.titol
      }), function(err, tascaCreada){
      if(err) {
        console.log(err)
      } else {
        console.log('aqui')
        Tasques.find({},function(err, tasks){
          if(err) console.log(err)
          else res.render('tasques',{tasks:tasks}); 
        })
      }
    })
    Block.create(new Block(
      {
        tipus:'creacioTasca', 
        emisor:req.session.passport.user,
        receptor:null, 
        tasca: req.body.tasca, 
        preu: req.body.preu, 
        acceptada:false, 
        acabada:false
      }),
    function(err, add) {
      if(err){
        console.log(err)
      }else{
        console.log('Transacció afegida al block')
      }
    }); 
  }
});

app.get('/modificaTasca', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Tasques.find({},function(err, tasks){
      if(err) console.log(err)
      else res.render('tasques',{tasks:tasks}); 
    })
  }
});

app.post('/modificaTasca', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Tasques.findOneAndReplace(
      {
        preu: req.body.preu,
        temps: req.body.temps,
        descripcio: req.body.descripcio,
        titol: req.body.titol
      },{
        preu: req.body.newPreu,
        temps: req.body.newTemps,
        descripcio: req.body.newDescripcio,
        titol: req.body.newTitol
      }, function(err, tascaCreada){
      if(err) {
        console.log(err)
      } else {
        Tasques.find({},function(err, tasks){
          if(err) console.log(err)
          else res.render('tasques',{tasks:tasks}); 
        })
      }
    })
    Block.create(new Trans(
      {
        tipus:'modificaTasca', 
        emisor:req.session.passport.user,
        receptor:null, 
        tasca: req.body.titol + '-->'+ req.body.newTitol, 
        preu: req.body.newPreu, 
        acceptada:false, 
        acabada:false
      }),
    function(err, add) {
      if(err){
        console.log(err)
      }else{
        console.log('Transacció afegida al block')
      }
    }); 
  }
});

app.post('/creacioTrans', function(req, res){
  if(!req.session){ 
    res.render('index')
  }else{
    console.log(req.body)
    Tasques.find({nom:req.body.tasca}, function(err, tasca){
      if(err) {
        console.log(err)
      } else {
        Trans.create(new Trans(
        {
          tipus:'transaccio', 
          emisor:req.body.emisor,
          receptor:req.body.receptor, 
          tasca: req.body.tasca, 
          preu: req.body.preu, 
          acceptada:false, 
          acabada:false
        }), 
        function(err, trans){
          if (err){
            console.log(err)
          } else {
            Usuari.find({}, 
            function(err, users){
              if(err) {
                console.log(err)
              } else {
                Tasques.find ({}, function(err, tasks){
                  res.render('trans', {
                    message: 'tasca creada', 
                    emisor:req.session.passport.user, 
                    users: users, 
                    tasks:tasks}
                  );
                });     
              }
            })
          }
        })    
      }
    });
    Block.create(new Trans(
      {
        tipus:'transaccio', 
        emisor:req.body.emisor,
        receptor:req.body.receptor, 
        tasca: req.body.tasca, 
        preu: req.body.preu, 
        acceptada:false, 
        acabada:false
      }),
    function(err, add) {
      if(err){
        console.log(err)
      }else{
        console.log('Transacció afegida al block')
      }
    }); 
  }
});

app.post('/cumplimentTasca', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Trans.findOneandUpdate({
      tipus:'transaccio', 
      emisor:req.body.emisor,
      receptor:req.body.receptor, 
      tasca: req.body.tasca, 
      preu: req.body.preu, 
      acceptada:false, 
      acabada:false
    }, { acceptada:true }, 
      function(err, trans){
        if(err)
          Usuari.find({username:req.session.passport.user},function(err, user) {
            console.log(user) //→ aqui extreus tota la info del usuari inclòs el seu ID
            if (err) {
              console.log(err)
              res.render('login');
            }
            else {
                Trans.find({Receptor: user.req.session.passport.user}, function(err, tasks){
                res.render('home', {user:user[0], tasks:tasks});
              });     
            }     
          });   
      })
    Block.create(new Trans(
      {
        tipus:'transaccio', 
        emisor:req.body.emisor,
        receptor:req.body.receptor, 
        tasca: req.body.tasca, 
        preu: req.body.preu, 
        acceptada:true, 
        acabada:false
      }),
    function(err, add) {
      if(err){
        console.log(err)
      }else{
        console.log('Transacció afegida al block')
      }
    }); 
  }
});

app.post('/acceptacioTasca', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    Trans.findOneandUpdate({
      tipus:'transaccio', 
      emisor:req.body.emisor,
      receptor:req.body.receptor, 
      tasca: req.body.tasca, 
      preu: req.body.preu, 
      acceptada:true, 
      acabada:false
    }, { acabada:true }, 
    function(err, trans){
      Usuari.find({username:req.session.passport.user},function(err, user) {
        if (err) {
          console.log(err)
          res.render('login');
        } else {
          Trans.find({Receptor: user.req.session.passport.user}, function(err, tasks){
            res.render('home', {user:user[0], tasks:tasks});
          });     
        }     
      });   
    })
    Block.create(new Trans(
      {
        tipus:'transaccio', 
      emisor:req.body.emisor,
      receptor:req.body.receptor, 
      tasca: req.body.tasca, 
      preu: req.body.preu, 
      acceptada:true, 
      acabada:true
      }),
    function(err, add) {
      if(err){
        console.log(err)
      }else{
        console.log('Transacció afegida al block')
      }
    });
  }
});

app.post('/eliminaTasca', function(req, res){
  if(!('passport' in req.session)){ 
    res.render('index')
  }else{
    console.log(req.body)
    Tasques.findOneAndDelete({
      titol:req.body.titol
    }, function(err, tasca){
      console.log(tasca)
      if(err){
        console.log(err)
      }else{
        Tasques.find ({}, function(err, tasks){
          res.render('Tasques', {tasks:tasks});
        });
      }
    })
    Block.create(new Trans(
      {
        tipus:'transaccio', 
      emisor:req.body.emisor,
      receptor:req.body.receptor, 
      tasca: req.body.tasca, 
      preu: req.body.preu, 
      acceptada:true, 
      acabada:true
      }),
    function(err, add) {
      if(err){
        console.log(err)
      }else{
        console.log('Transacció afegida al block')
      }
    });
  }
});


app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});







