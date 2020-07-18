const express  = require('express');//Inicializamos express
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const encriptando = require('../helpers/encripts');
const { isAuthenticated } = require('../helpers/auth');//Esto sirve para autenticar que esta iniciada la sesión

router.get('/users/signin', (req, res)=>{
    res.render('users/signin');
});


//RUTA PARA MODIFICACION DE CONTRASEÑA
router.get('/users/password/', isAuthenticated, (req,res) =>{
    res.render('users/password');
});
router.put('/users/password/:id', isAuthenticated, async (req,res) =>{
    var {password_old,password, password_new_confirm} = req.body;
    const errors = [];
    if(password_old.length <= 0){
        errors.push({text: 'Plase Insert password old'});
    }
    if(password.length <= 0){
        errors.push({text: 'Plase Insert password old'});
    }
    if(password_new_confirm.length <= 0){
        errors.push({text: 'Plase Insert password old'});
    }
    if(password != password_new_confirm){
        errors.push({text: 'New password not match'});
    }
    if(errors.length > 0){
        res.render('users/password',{errors});
    }else{
        const user = await User.findById(req.params.id);
        const match = await user.matchPassword(password_old);
        if(match){
           password = await encriptando.encriptar(password);
            await User.findByIdAndUpdate(req.params.id, {password});
            req.flash('sucess_msg','User password Change Successfully');
            res.redirect('/notes');
        }else{
            req.flash('error_msg','Plase Insert the correct password');
            res.redirect('/users/password');
        }
        
    }
});

//Perfil y modificacion del perfil del usuario
router.get('/users/profile/', isAuthenticated, (req,res) =>{
    res.render('users/profile');
});

//Ruta de manipulacion de datos para guardar en la base
router.put('/users/profile/:id', isAuthenticated, async (req,res)=>{
    const {name,email} = req.body;
    const errors = [];
    if(name.length <= 0){
        errors.push({text: 'Plase Insert your name'});
    }
    if(email.length <= 0){
        errors.push({text: 'Plase Insert your email'});
    }
    if(errors.length > 0){
        res.render('users/profile', {errors});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            if(emailUser.id != req.params.id){
                req.flash('error_msg','Error Email in use');
                res.redirect('/users/profile');
            }else{
                await User.findByIdAndUpdate(req.params.id, {name,email});
                req.flash('sucess_msg','User Updated Successfully');
                res.redirect('/users/profile');
            }
        }else{
            await User.findByIdAndUpdate(req.params.id, {name,email});
            req.flash('sucess_msg','User Updated Successfully');
            res.redirect('/users/profile');
        }
        
    }
});
//Esta ruta hace un redireccionamiento si la autenticacion es correcta
router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req,res) =>{
    res.render('users/signup');
});
router.post('/users/signup', async (req,res)=>{
    const {name,email,password,confirm_password} = req.body;
    const errors = [];
    if(name.length <= 0){
        errors.push({text: 'Plase Insert your name'});
    }
    if(email.length <= 0){
        errors.push({text: 'Plase Insert your email'});
    }
    if(password.length <= 0){
        errors.push({text: 'Plase Insert your password'});
    }
    if(confirm_password.length <= 0){
        errors.push({text: 'Plase Insert your other password'});
    }
    if(password != confirm_password){
        errors.push({text: 'Password do not match'});
    }
    if(password.length < 4){
        errors.push({text: 'Password must be al least 4 characters'});
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name,email,password,confirm_password});
    }else{
        //Validamos email repetidos
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg','The Email is alredy in use');
            res.redirect('/users/signup');
        }else{
            const newUser = new User({name, email, password});//Se crea el objeto new User
            newUser.password =await newUser.encryptPassword(password);//Se da un nuevo valor al password del objeto
            await newUser.save();
            req.flash('sucess_msg','You are registered');
            res.redirect('/users/signin');
        }
        
    }
});

router.get('/users/logout',(req,res) =>{
    req.logout();
    res.redirect('/users/signin');
});

module.exports = router;