const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//Se usara para consultar
const User = require('../models/User');

//Configuramos  se usa para poder definir una nueva strategia de autenticacion

passport.use(new LocalStrategy({
    usernameField: 'email' //Autenticamos el email
}, async (email,password,done)=>{//Recibimos email pass y el done para autenticar
    const user = await User.findOne({email: email}); 
    if(!user){
        return done(null, false, {message: 'Not User Found'});//Sirve para terminar el proceso de autenticación puede terminar con error o sin usuario
    }else{
        //Si llega aqui el correo existe entonces es momento de autenticas la contraseña
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);//Primer dato para retornar error el segundo es si hay algun usuario y el terceri msg
        }else{
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

//Este toma un id y forma un usuario
passport.deserializeUser((id,done) =>{
    User.findById(id, (err,user) =>{
        done(err,user);
    });
});