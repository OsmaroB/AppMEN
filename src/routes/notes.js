const express  = require('express');//Inicializamos express
const router = express.Router();
const Note = require('../models/Note');//Este note nos permitira poder guardar y modificar datos con codigo ocupa sus metodos
//Al crear un schema se crea una clase y Note es usada de esa manera
const { isAuthenticated } = require('../helpers/auth');//Esto sirve para autenticar que esta iniciada la sesión

//CREATE
//Muestra y renderizado de vista
router.get('/notes/add', isAuthenticated ,(req,res)=>{
    res.render('notes/new-note');
});
//Ruta de manejo de datos para creacion
router.post('/notes/new-note', isAuthenticated, async (req,res)=>{//La palabra clave async hace que el codigo escrito sea asincrono
    const {title,description} = req.body;
    const errors = [];
    if(!title){
        errors.push({text: 'Please write a title'});
    }
    if(!description){
        errors.push({text: 'Please write a description'});
    }
    if(errors.length >0){
        res.render('notes/new-note',{
            errors,
            title,
            description
        });
    }else{
        //En esta linea solo se procesa a la clase aun no esta guardado en la base
        const newNote = new Note({title,description});//Agregamos en la clase Note con llaves el titulo y descripcion para que procese
        newNote.user = req.user.id;//Ese req.use.id se puede usar gracias a passport con su autenticación
        await newNote.save();//La palabra await le dice al codigo que tomara un tiempo de ejecucion y delega cuando termine
        req.flash('sucess_msg','Nota Added Successfully');
        res.redirect('/notes');//Cuando termine de guardar enviara a esta ruta
    }
});
//UPDATE
//Ruta de lectura de datos y renderizado de vista
router.get('/notes/edit/:id', isAuthenticated, async (req,res)=>{
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note',{note});
});
//Ruta de manipulacion de datos para guardar en la base
router.put('/notes/edit-note/:id', isAuthenticated, async (req,res)=>{
    const {title,description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title,description});
    req.flash('sucess_msg','Note Updated Successfully');
    res.redirect('/notes');
});
//READ
//Ruta para listar las notas creadas y renderizar la vista
router.get('/notes', isAuthenticated , async (req,res) =>{
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});//Recolectamos datos de la base de datos
    res.render('notes/all-notes',{notes});
});
//DELETE
router.delete('/notes/delete/:id', isAuthenticated, async (req,res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('sucess_msg','Note Deleted Successfully');
    res.redirect('/notes');
});


//Rutas para recibir datos


module.exports = router;