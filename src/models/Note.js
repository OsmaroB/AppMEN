const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    title: {type: String, required:true},//Ponemos campo de tipo string requerido
    description: {type: String, required: true},//Ponemos campo de tipo string requerido
    date: {type: Date, default: Date.now},//Aca pone un campo tipo date que mandara de forma default la fecha actual
    user: {type: String}
});


module.exports = mongoose.model('Note',NoteSchema);//Exportamos el modulo con modelo de mongose nombrandolo Note con el esquema creado
