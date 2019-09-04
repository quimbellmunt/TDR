var express = require("express");
var session = require('express-session');
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
app.use(express.static(__dirname + '/public'));

var app = express();
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(session({secret: 'TdR',saveUninitialized: true,resave: true}));

mongoose.connect('mongodb://localhost:27017/Treball');

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


const Login = require('./models/login');   

const Tasques = require('./models/tasques');
const Transaccio = require('./models/transaccions');
const Users = require('./models/users');
const Block = require('./models/block');


passport.use(new LocalStrategy(Login.authenticate()));

passport.serializeUser(Login.serializeUser());
passport.deserializeUser(Login.deserializeUser());




app.get('/', function (req, res) {
    console.log(req.session) 
   if('passport' in req.session) {
    res.redirect('/inici')
   } else {
    res.render('index');
   }    
});




app.get('/register', function(req, res) {
  if('passport' in req.session){
    res.redirect('/inici');
  } else {
    res.render('index');
  }
});


app.get('/login', function(req, res) {
    res.redirect('/')
});


app.get('/inici', function(req, res){
  if('passport' in req.session){
    Users.find({}, function(err,users){
      if(err){ 
        console.log(err)
      }else{
        Tasques.find({}, function(err,tasques){
          if(err){
            console.log(err)
          } else {
            Transaccio.find({usuariReceptor:req.session.passport.user}, function(err,transUsuari){
              if(err){
                console.log(err)
              }else{
                Users.findOne({username:req.session.passport.user}, function(err,userito){
                  if (err){
                   console.log(err)
                   }else{
                    res.render('home', {usuaris:users, tasques:tasques, transaccions:transUsuari, emisor:req.session.passport.user, userito:userito})
                   }
                })
              }
            })
          }
        })
      }
    })
  } else {
    res.redirect('/login')
  }
});

app.get('/usuari', function(req,res) {
  if('passport' in req.session){
    Users.findOne({username: req.session.passport.user}, function(err,user) {
      if(err){
        console.log(err)
      }else{
        console.log(user)
        res.render('usuari', {userito:user})                                                                
      }
    })
  }else{
    res.redirect('/') 
  }
});

app.get('/tasques', function(req,res) {
  if('passport' in req.session){
    Tasques.find({},function(err, tasks){
      // console.log(tasks)
      if(err) console.log(err)
      res.render('tasques',{tasques:tasks}); 
    })
  } else {
    res.render('index');
  }
});

app.get('/blockchain', function(req,res){
  if('passport' in req.session) {
    res.render('blockchain')
  }else{
    res.render('index')
  }
});


app.post('/modificarTasca', function(req,res) {
if('passport' in req.session){
  Tasques.findOneAndUpdate(
    {nomTasca:req.body.nomTasca},
    {nomTasca:req.body.nomTasca, 
      preu:req.body.preu, 
      temps:req.body.temps, 
      descripcio:req.body.descripcio},
  function(err,tasques){
    if (err) {
      console.log (err)
    }else{

      res.redirect('/tasques')
    }
   })
  Block.create(new Block(
  {tipus:'ModificacioTasca',
  emisor:req.session.passport.user,
  receptor: null,
  tasca:req.body.nomTasca, // aquí he de canviar això, afegir info tasca antiga, tasca nova
  preu:req.body.preu, //falta que sigui el nou però no se segur si newreu funciona
  acceptada:false,
  acabada: false
  }, function(err, add){
    if(err){
      console.log(err)
    }else{
      console.log('Activitat registrada')
    }
  }))  
} else {
   res.redirect('/index')
}

});
  
app.post('/crearTasca', function(req,res) {
  console.log(req.body)
  Tasques.create(new Tasques({nomTasca:req.body.nomTasca, preu:req.body.preu, temps:req.body.temps, descripcio:req.body.descripcio}),
  function(err,tasques){
    if (err){
      console.log(err)
    }
    else {
      res.redirect('/tasques')
    }})
  Block.create(new Block(
    {tipus:'CreacioTasca',
    emisor:req.session.passport.user,
    receptor: null,
    tasca:req.body.nomTasca, //afegir dades tasca
    preu:req.body.preu, 
    acceptada:false,
    acabada: false},
  function(err, add){
    if(err){
      console.log(err)
    }else{
      console.log('Activitat registrada')
    }
  }))  
});

app.post('/transaccio', function(req,res) {
console.log(req.body)
 if('passport' in req.session){
  Tasques.findOne({nomTasca: req.body.tasca}, function(err, tasca){
    if(err) console.log(err)
    else {
      Transaccio.create(new Transaccio ({usuariOrigen:req.body.emisor, 
        usuariReceptor:req.body.receptor, 
        tasca:req.body.tasca, 
        preu:tasca.preu,
        rebutjada:false,
        acabada:false

      }), function(err, transCreate){
        if(err){
          console.log(err)
        }else{
          res.redirect('/inici')
        }
      })
    }
  })
  Block.create(new Block(
    {tipus:'Trans',
    emisor:req.session.passport.user,
    receptor: req.body.receptor,
    tasca: req.body.tasca,
    preu:req.body.preu, 
    acceptada:false,
    acabada: false
  }, function(err, add){
    if(err){
      console.log(err)
    }else{
      console.log('Activitat registrada')
    }
  }))  
}
 
});




app.post('/modificarUsuari', function(req,res) {
 if('passport' in req.session){
  console.log(req.body)
  Users.findOneAndUpdate(
    {username:req.body.username},
    {nomUsuari:req.body.nomUsuari, 
      cognoms:req.body.cognoms, 
      username:req.body.username, 
      mail:req.body.mail}, 
  function(err,users) {
    if(err) {
      console.log(err)
    }else{
      res.redirect('/usuari')
    }
  })
  Block.create(new Block(
  {tipus:'ModificacioUsuari',
  emisor:req.session.passport.user,
  receptor: null,
  tasca: 'modificaUsuari' ,
  preu:null, 
  acceptada:false,
  acabada: false
  }, function(err, add){
    if(err){
      console.log(err)
    }else{
      console.log('Activitat registrada')
    }
  })) 
 } else {
  res.redirect('/index')
 }    
});



app.post('/esborrarTasca', function(req, res) {
if('passport' in req.session){
  Tasques.findOneAndDelete(
    {nomTasca:req.body.nomTasca}, 
  function(err, tascaEsborrada){
    if(err) { 
      console.log(err) 
    } else { 
      res.redirect('/tasques')
    }
  })   
 Block.create(new Block(
  {tipus:'EliminacioTasca',
  emisor:req.session.passport.user,
  receptor: null,
  tasca: req.body.tasca,
  preu:req.body.preu,
  acceptada:false,
  acabada: false
  }, function(err, add){
    if(err){
      console.log(err)
    }else{
      console.log('Activitat registrada')
    }
  })) 
  } else {
    res.redirect('/index')
  }     
});

app.post('/TascaRebutjada', function(req, res) {
  if('passport' in req.session){
    console.log(req.body)
    Transaccio.findOneAndDelete(
    {usuariOrigen:req.body.emisor, 
    usuariReceptor:req.body.receptor, 
    tasca:req.body.tasca}, 
    function(err,transBye){
      if(err){
        console.log(err)
      }else{
        res.redirect('/inici')
      }
    })
   Block.create(new Block(
    {tipus:'TascaRebutjada',
    emisor:req.session.passport.user,
    receptor: req.body.receptor,
    tasca: req.body.tasca,
    preu:req.body.preu, 
    acceptada:false,
    acabada: true
    }, function(err, add){
      if(err){
        console.log(err)
      }else{
        console.log('Activitat registrada')
      }
    }))  
 } else {
    res.redirect('/index')
  } 
});

app.post('/tascaAcabada', function(req, res) {
  if('passport' in req.session){
    Transaccio.findOneAndDelete({usuariOrigen:req.body.emisor, usuariReceptor:req.body.receptor, tasca:req.body.tasca}, 
    function(err,transBye){
      if(err){
        console.log(err)
      }else{
        Users.findOne({username:req.body.receptor},
        function(err, userReceptor) {
          if (err) {
            console.log(err)
          } else {
            var newMonederReceptor = transBye.preu + userReceptor.moneder
            Users.findOneAndUpdate({username: userReceptor.username}, {moneder:newMonederReceptor},function(err, ok){
              if(err) {
                console.log('error')
              } else {
                console.log('Diners afegits al receptor')
              }
            })
          }      
        });
        Users.findOne({username:req.body.emisor},
        function(err, userOrigen) {
          if (err) {
            console.log(err)
          } else {
            var newMonederEmisor = userOrigen.moneder - transBye.preu
            Users.findOneAndUpdate({username: userOrigen.username},{ moneder:newMonederEmisor},function(err, ok){
              if(err) {
                console.log(err)
              } else {
                console.log('Diners retinguts al emisor al receptor')
              }
            })
          }     
        });
        res.redirect('/inici')
      }
      Block.create(new Block(
      {tipus:'tascaAcabada',
      emisor:req.session.passport.user,
      receptor: req.body.receptor,
      tasca: req.body.tasca,
      preu:req.body.preu, 
      acceptada:true,
      acabada: true
      }, function(err, add){
        if(err){
          console.log(err)
        }else{
          console.log('Activitat registrada')
        }
      }))  
    })
  } else {
    res.redirect('/index')
  } 
});



app.post('/login', passport.authenticate('local', { 
  successRedirect: '/inici',
  failureRedirect: '/'
}))

app.post('/register', function(req, res) {
  Login.register(new Login({ username : req.body.username }), req.body.password, function(err, user) {
      if (err) {
          console.log(err)
          return res.render('index');
      }
      
      Users.create(new Users({ 
        nomUsuari: req.body.nomUsuari, 
        cognoms: req.body.cognoms, 
        username: req.body.username, 
        mail: req.body.mail, 
        moneder: 20}), 
        function(err,userito){
          if (err) console.log(err)
          else {
            passport.authenticate('local')(req, res, function () {
              res.redirect('/inici')
          });
            
          }
        })
  });
  Block.create(new Block(
  {tipus:'registreUsuari',
  emisor:req.body.nomUsuari,
  receptor: null,
  tasca: null,
  preu:null, 
  acceptada:false,
  acabada: false
  }, function(err, add){
    if(err){
      console.log(err)
    }else{
      console.log('Activitat registrada')
    }
  }))  
});

app.post('/logout', function(req, res) {
    req.logout();
    res.render('index');
});


app.post('/descarrega', function(req,res){
  Block.findOne({tipus:'Trans', emisor:req.session.passport.user}, function(err,hash){
    if(err){
      console.log(err)
    }else{
      console.log('Funciona')
    }
  }).limit(10) 
});
//Quim: POST Descarrega fa elm mateix que actualizació? Aleshores amb un botonet GET ja fem. 
// app.post('/descarrega', function(req,res) {
//   // La descarrega, és a dir, en el que entra la blockchain el que interessa primer és agafar tot el que hi hagi a la base de dades i hagi hagut abans, per tant, tots els canvis.
//   //Suposo que pel que ja existeeix seria alguna cosa com Tasques.find({}), Users.find i tota la pesca (potser només cal fer Block.find perquè no sé que és del tot). Això es reuneix en un fitxer que s'ha d'encriptar i va variant cada vegada que passa alguna cosa a la web.
//   //(Crec que per això serveix el model de block que ha aparegut per aquí, no estic del tot segura).
//   //Aleshores aquí, després d'aconseguir posar tota la info en el document, el que s'ha de fer és enviar el mail i per això serveix el The Nodemailer module. 
//   //(A més a més, m'he d'enrecordat que a dalt del botó, al front-end he de fer un get pel nom de la última versió).  
//   });


app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
}); 
