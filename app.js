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



// obrir la pagina d'inici index.ejs
app.get('/', function (req, res) { //la primera interpretació d'aquestes dues línies és que si encara no s'ha entrat a cap usuari aleshores que vagi a index.
   console.log(req)
   if('session' in req) {
    res.render ('index')
   } else {
    res.render('index');
   }    
});

// obrir la pagina registre index.ejs
app.get('/register', function(req, res) {
    res.render('index');
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
        // res.render('home',{tasques : null});
      });
      Users.register (new Users ({ nomUsuari: req.body.nomUsuari, cognoms: req.body.cognoms, username: req.body.username, mail: req.body.mail}), 
        function(err,userito){
          if (err) console.log(err)
          else {
            res.render('home',{tasques : null, usuario:userito});
          }
        })
  });
});
//Aquí crec que s'hauria d'afegir això:
//Users.register (new Users ({ nomUsuari: req.body.nomUsuari, cognoms: req.body.cognoms, username: req.body.username, mail: req.body.mail}), req.body.password, function(err,userito))
//if(err) {console.log (err)}
// quasi bé. El password no el vols guardar pertant no l'has de guardar... 
// Ei! on esta el if(err) de la creació?
// Ep! ara fas un cosa mes... per tant elm res vé mes tard! 




//localhost:3000/login es igual a localhost:3000 e igual a localhost:3000/registre
app.get('/login', function(req, res) {

    res.render('index', {usertrans:null, tasques : null});
});


//Usuari introdueix les dades del seu login a index.ejs   //quan he entrar a home, a dalt posa localhost:3000/login... Això és per culpa del següent o perquè?
app.post('/login', passport.authenticate('local'), function(req, res) {
    console.log('aqui')
    res.redirect('home');
});


// usuari surt de la plataforma--> aquest controlador es el boto logout de les pagines ejs
app.post('/logout', function(req, res) {
    req.logout();
    res.render('index');
});

// obrir pagina localhost:3000/home --> home.ejs
app.get('/home', function(req, res){
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



app.post('/modificacio', function(req,res) {
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

//que estas intentant fer aquúí? que fa aquest get /userTrans i que fa el get /tasktrans
//el problema es que no pot fer-ho serparadament... ho has de posar en la mateiuxa funciuó Get. 
// i a mes a mes com ha d'enviar-ho tot junt has de incloure una funció dins de l'altre. 
// un altre cosa perque busques req.body.nomUsuari... aquí no estan enviant informació. la estas recuperant... he déntendre que vols fer aquí perque despres ho envies a home
// mira la meva branca per que vegis com es fan aquest tipus de crides. Haueras dádaptar el vocabulari perque no ho he fet encara pero agafa ideas...
// no sembla que estiguis fent recerca per internet de com es fan les coses iu molt mes facil en el mateix repositori... 


app.post('/create', function(req, res) {
  //Avui has de crear un parell de tasques Andrea: no puc accedir a la pàgina de tasques
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
//Aquest botó de create està bé? O la part de new tasques no ho està? No esta bé
// Ei! tens examples de com crear nous documents en la base de dades... linea 66 de app.js
// Si us plau mira examples


//Ususari modifica la seva informacio personal
app.post('/modificarUsuari', function(req,res) {
  // avui fes la info del usuari 
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

//Usuari accepta la tasca




app.post('/descarrega', function(req,res) {
  // La descarrega, és a dir, en el que entra la blockchain el que interessa primer és agafar tot el que hi hagi a la base de dades i hagi hagut abans, per tant, tots els canvis.
  //Suposo que pel que ja existeeix seria alguna cosa com Tasques.find({}), Users.find i tota la pesca (potser només cal fer Block.find perquè no sé que és del tot). Això es reuneix en un fitxer que s'ha d'encriptar i va variant cada vegada que passa alguna cosa a la web.
  //(Crec que per això serveix el model de block que ha aparegut per aquí, no estic del tot segura).
  //Aleshores aquí, després d'aconseguir posar tota la info en el document, el que s'ha de fer és enviar el mail i per això serveix el The Nodemailer module. 
  //(A més a més, m'he d'enrecordat que a dalt del botó, al front-end he de fer un get pel nom de la última versió).  
  });

app.get('/inici', function(req,res) {
      res.render('home')

    });

app.get('/actualitzacio', function(req,res) {
   console.log(req.body)
      res.render('home') //Tot i així, aquí falta que es pugui connectar amb la meitat de la pàgina de home 
    });
  //Aquest es el boto a on l'usuari demana el nou fitxer per mail



app.get('/informacio', function(req,res) {
      res.render('home') //falta també poder accedir a la meitat per trobar-se primer amb informació 
    });

app.get('/modificacioUsuari', function(req,res) {
  if('passport' in req.session){
    Users.findOne({username: req.session.passport.username}, function(err,user){
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
  res.render('tasques')
})

//app.get('/tasques', function(req,res) {
  //Tasques.find({}, function(error, tasksToShow) {
    //console.log(tasksToShow)
    //res.render('tasques', {tasques: tasksToShow})
  //});
//});

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
}); //no em deixa llençar l'app (per la finestra) perquè diu que aquest tancament és un unexpected token, quan literal que no le tocat en la vida. 



//Andrea: Aquí hi havia diferents coses que sortien de color rosa:
// - abans del app descarregar hi havia un <<<<<<<HOME però em posava que no es podia llençar app amb unexpected token <<
// - abans de codi que fa que el servidor s¡aixequi hi havia ========= però tampoc em deixava 
// - després de ====== hi havia >>>>>>>d4ec5a9ad6743a1a2473aa51b0f086d63d9a6d74 però tampoc reconeixia res d'això. 