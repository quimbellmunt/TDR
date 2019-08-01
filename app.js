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
   console.log(req)
   if('session' in req) {
    res.render ('index')
   } else {
    res.render('index');
                                 // , {usertrans:null, tasques : null});
   }    
});


app.get('/registre', function(req, res) {
    res.redirect('/');
});


app.get('/login', function(req, res) {

    res.redirect('/')
});


app.get('/inici', function(req, res){
  console.log(req)
  if('passport' in req.session){
    Users.find({}, function(err,users){
      console.log('Aqui1')
      if(err){ 
        console.log(err)
      }else{
        Tasques.find({}, function(err,tasques){
          console.log('Aqui2')
          if(err){
            console.log(err)
          } else {
            Transaccio.find({usuariReceptor:req.session.passport.user}, function(err,transUsuari){
              console.log('Aqui3')
              if(err){
                console.log(err)
              }else{
                res.render('home', {usuaris:users, tasques:tasques, transaccions:transUsuari})
              }
            })
          }

        })
      }
    })
  } else {
    res.redirect('index')
  }
  

//Users.find()
});

app.get('/home', function(req,res) {
      res.redirect('/inici')

    });

app.get('/actualitzacio', function(req,res) {
   console.log(req.body)
      res.redirect('/inici') //Tot i així, aquí falta que es pugui connectar amb la meitat de la pàgina de home 
    });
  //Aquest es el boto a on l'usuari demana el nou fitxer per mail



app.get('/informacio', function(req,res) {
      res.redirect('/inici') //falta també poder accedir a la meitat per trobar-se primer amb informació 
    });

app.get('/modificacioUsuari', function(req,res) {
  if('passport' in req.session){
    Users.findOne({username: req.session.passport.username}, function(err,user) {
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

app.get('/tasca', function(req,res) {

   Tasques.find({}, function(err, tasques) {
    if(err){ 
      console.log(err)
    }else{
        res.render('tasques',{tasques : tasques}) 
      }
});


app.get('/creacioTasca', function(req,res) {
 res.redirect('/tasca')//falta
  });
      
});

app.get('/modificacioTasca', function(req,res) {
      res.redirect('/tasca')  //falta
    });

app.get('/eliminacioTasca', function(req,res) {
      res.redirect('/tasca')//falta
    });

app.get('/usuari', function(req,res) {
  res.redirect('/modificacioUsuari')
}); 


app.post('/register', function(req, res) {//mirar comentaris
  console.log(req.body)
  Login.register(new Login({ username : req.body.username }), req.body.password, function(err, user) {
      if (err) {
          console.log(err)
          return res.render('index');
      }
      passport.authenticate('local')(req, res, function () {
        // res.render('home',{tasques : null});
      });
      Users.register (new Users ({ nomUsuari: req.body.nomUsuari, cognoms: req.body.cognoms, username: req.body.username, mail: req.body.mail}), 
        function(err,userito){
          if (err) console.log(err)
          else {
            res.render('home',{tasques : null, usuario:userito});
          }
        })
//Users.register (new Users ({ nomUsuari: req.body.nomUsuari, cognoms: req.body.cognoms, username: req.body.username, mail: req.body.mail}), req.body.password, function(err,userito))
//if(err) {console.log (err)}
// Ei! on esta el if(err) de la creació?
// Ep! ara fas un cosa mes... per tant elm res vé mes tard! 
  });
});


app.post('/modificaciot', function(req,res) {
  //Primer de tot, fas Tasques.findOneAndUpdate i poses, sempre d'una d'elles, 
  //les diferents característiques que poden canviar (ja que no és necessari canviar tot, per tant s'ha de poder aclarir que si no s'ha posat res en l'input del front-end, aleshores vol dir que has de posar per a que et posi la mateixa info que hi havia abans)
});// Un cop agafat crec que el find one ja s'encarrega d'accedir a la base de dades i el update s'encarrega de canviar-ho a la mateixa base, per tant jo no crec que falti res més a part de fer console.log en el cas de que doni err. 

app.post('/transaccio', function(req,res) {
  //(Comentari en ejs) var transaction = new Transaccio ({aquí ha d'agafar tot la info que vol guardar a la base de dades (el usuariOrigen és el mateix que ho realitza)})
  //Transaccio.create(transaction, function(err,transaction) {
  // if (err) console.log(err)
  //else{
    //console.log('transaction',transaction)
    //res.render('home')
    //A la vegada, aquesta transacció quan es crea ha d'apareixer a les tasques pendents (s'hauria de fer que al posar transaccions a tasques pendents, a part de posar length >0, també s'hauria de posar la condició de que tu fossis usuariReceptor) d'una persona i que aquesta ho pugui acceptar o acabar. 
    //Si s'accepta o s'acaba, és nova informació que es tindrà de la transaccio, però s'haurà de fer com si fos una nova perquè per defecte, a la primera, el tipus hauria de ser enviada. 
    //(D'aquesta manera es queda registrat tot el que passa) 
    //Podria també passar-se per mail al usuariReceptor però això ja és valor afegit. 

   // console.log(req.body)

  });


app.post('/create', function(req, res) { //No està bé, modificar
 
  console.log(req.body)
  //var createdTask = new Tasques({nomTasca: req.body.nomTasca, preu: req.body.preu, temps: req.body.temps, descripcio: req.body.descripcio});
  Tasques.create(createdTask, function(err, createdTask){
    if (err) console.log(err) 
    else {
      console.log('created task', createdTask)
      res.render('tasques', {tasques : createdTask})
    }
  })
});


app.post('/modificarUsuari', function(req,res) {
  
  console.log(req.body)
  Users.findOneAndUpdate({nomUsuari:req.body.nomUsuari, cognoms:req.body.cognoms, username:req.body.username, mail:req.body.mail, password:req.body.password}, 
    function(err,users) {
      if(err) {
        console.log(err)
        
      }else{
        Trans.find({Receptor: user.id}, function(err, tasks){
        res.render('usuari', {useritos:users, tasks:tasks});
        }); 
      }    
    })
});

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



app.post('/tascaAcabada', function(res) {

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
  //var acceptada = false
  //var acabada = false 
  //Has de fer que quan es cancel·la una tasca s'ha d'anar de la llista de tasques pendents de la persona, per tant és com si eliminessis la transacció
  //Transaccio.findOneAndDelete(identificadorTrans: req.body.identificadorTrans, function (err, tascancelada)
  //if(err) console.log (err)
  //});
  res.render('home')
});

app.post('/TascaRebutjada', function(res) {
  //req.body.emisor
  //var acabada = !false;
  // En el cas de cancelada s'envia mail (The Nodemailer module) a usuariOrigen per dir que s'ha cancelat. 
  // Quim: aixo es part del controlador
  res.render('home')
});


app.post('/login', passport.authenticate('local'), function(req, res) {
    console.log('aqui')
    res.redirect('home');
});

app.post('/logout', function(req, res) {
    req.logout();
    res.render('index');
});


app.post('/descarrega', function(req,res) {
  // La descarrega, és a dir, en el que entra la blockchain el que interessa primer és agafar tot el que hi hagi a la base de dades i hagi hagut abans, per tant, tots els canvis.
  //Suposo que pel que ja existeeix seria alguna cosa com Tasques.find({}), Users.find i tota la pesca (potser només cal fer Block.find perquè no sé que és del tot). Això es reuneix en un fitxer que s'ha d'encriptar i va variant cada vegada que passa alguna cosa a la web.
  //(Crec que per això serveix el model de block que ha aparegut per aquí, no estic del tot segura).
  //Aleshores aquí, després d'aconseguir posar tota la info en el document, el que s'ha de fer és enviar el mail i per això serveix el The Nodemailer module. 
  //(A més a més, m'he d'enrecordat que a dalt del botó, al front-end he de fer un get pel nom de la última versió).  
  });


app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
}); 

