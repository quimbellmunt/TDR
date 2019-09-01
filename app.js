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
              console.log(transUsuari)
              if(err){
                console.log(err)
              }else{
                res.render('home', {usuaris:users, tasques:tasques, transaccions:transUsuari, emisor:req.session.passport.user})
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

app.get('/home', function(req,res) {
  console.log(req.session)
   if('passport' in req.session){
    res.redirect('/inici');
  } else {
    res.redirect('/login');
  }
});

app.get('/actualitzacio', function(req,res) {

  if('passport' in req.session){
    res.redirect('/inici')
  } else{
    res.redirect('/login');
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

// Quim: estic una mica liat... GET modifcacioTasca i Tasca semblent per mi e, mateix... els dos volen obrir la pagina de tasques. 
// Jo esculliria tasca o millor tasques perque la view es diu tasques. 

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


app.post('/modificarTasca', function(req,res) {
if('passport' in req.session){
    console.log(req.body)
Tasques.findOneAndUpdate({nomTasca:eq.body.nomTasca},{nomTasca:req.body.nomTasca, preu:req.body.preu, temps:req.body.temps, descripcio:req.body.descripcio},
function(err,tasques){
  if (err) {
    console.log (err)
  }else{
    res.redirect('/tasques')

  }
 })
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
  // Quim: aqui no fas find, has de fer register new tasca
  // Tasques.find({},function(err, tasques){
  //   if(err) console.log(err)
  //   res.render('tasques', {tasques : tasques}) 
  // })     
});




app.post('/transaccio', function(req,res) {
console.log(req.body)
 if('passport' in req.session){
  console.log(req.body)
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
  
 }
});





//Ususari modifica la seva informacio personal
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
     } else {
      res.redirect('/index')
     }   
});

app.post('/esborrarTasca', function(req, res) {

  Tasques.findOneAndDelete({nomTasca:req.body.nomTasca}, function(err, tascaEsborrada){
    if(err) { 
      console.log(err) 
    } else {
      //ara amb el redirect es molt mes faicl! Tots el post acaben amb res.redirect
      res.redirect('/tasques')
      // Tasques.find({},function(err, tasques){
      //   if(err) console.log(err)
      //   res.render('tasques',{tasques : tasques}) 
      // })
    }
  })   
});

//Quim: TascaCancelada i TascaRebutjada no fan el mateix?

app.post('/TascaRebutjada', function(req, res) {
  console.log(req.body)
Transaccio.findOneAndDelete({usuariOrigen:req.body.emisor, usuariReceptor:req.body.receptor, tasca:req.body.tasca}, 
  function(err,transBye){
    if(err){
      console.log(err)
    }else{
      res.redirect('/inici')
    }
  })


});



app.post('/tascaAcabada', function(req, res) {

Transaccio.findOneAndDelete({usuariOrigen:req.body.emisor, usuariReceptor:req.body.receptor, tasca:req.body.tasca}, 
  function(err,transBye){
    if(err){
      console.log(err)
    }else{
      Users.findOne({username:req.body.receptor},
      function(err, userReceptor) {
      if (err) {
        console.log(err)
      }
      else {
        console.log(userReceptor)
        var newmoneder = transBye.preu + userReceptor.moneder
        console.log(newmoneder)
      Users.findOneAndUpdate(userReceptor,{moneder:newmoneder},function(err, ok){
          if(err) {
            console.log('Error')
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
      }
      else {
        console.log(userOrigen)
        var newmoneder = userOrigen.moneder - transBye.preu
        console.log(newmoneder)
        Users.findOneAndUpdate(userOrigen,{moneder:newmoneder},function(err, ok){
          if(err) {
            console.log('Error')
          } else {
            console.log('Diners afegits al receptor')
          }
        })
        
      }     
    });
      res.redirect('/inici')
    }
  })

});




app.post('/login', passport.authenticate('local'), function(req, res) {
    console.log(req.session)
    res.redirect('/inici');
});

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
              res.redirect('/home')
          });
            
          }
        })
  });
});

app.post('/logout', function(req, res) {
    req.logout();
    res.render('index');
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
