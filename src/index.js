const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const methodOverride =require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
//Initializations
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 5000); //Si existe un puesto tomalo sino usa 3000
app.set('views', path.join(__dirname, 'views'));//path.join concatena directorios __dirname retorna el direccorio y agregamos views
//ESTO SIRVE PARA PONER LAS VISTAS
//Definimos la plantilla adonde realizaremos los diseños
app.engine('.hbs', exphbs({
    defaultLayout: 'main',//Destinamos adonde estara el layout default
    layoutsDir: path.join(app.get('views'),'layouts'),//Destinamos el directorio de los layouts
    partialsDir: path.join(app.get('views'), 'partials'),//Destinamos los elementos parciales
    extname: '.hbs',
    handlebars: handlebars
}));
app.set('view engine','.hbs');//Aca terminas de listar las vistas decimos que van a terminar en .hbs
//FIN DE LA CONFIGURACIÓN DE LAS VISTAS

//Middlewares
app.use(express.urlencoded({extended: false}));//Aca aceptas que el servidor pueda recolectar datos el extended false quita la opcion de enviar img
app.use(methodOverride('_method'));//Sirve para que los formularios puedan enviar otro tipo de metodos como put y delete
app.use(session({//Con esta configuracion podras autenticar al usuario y almacenar sus datos de forma temporal
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global varibles
app.use((req,res,next) =>{
    res.locals.sucess_msg = req.flash('sucess_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


//Routes
//OJO si las rutas estan vacias dara un error que necesita un middlewear
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Statics
app.use(express.static(path.join(__dirname,'public')));

//Server is listenning
app.listen(app.get('port'), ()=>{
    console.log('Server on port: ', app.get('port'));
});