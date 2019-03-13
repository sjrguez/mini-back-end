var mongoose = require('mongoose');

var Schema = mongoose.Schema

var tipoUsuarioSchemam= Schema({
    nombre:{type:String,required:false},
    estado:{type:Number,required:false,default:1},
    fecha_creacion:{type:Date,required:false,default:new Date().getTime()},
    fecha_modificado:{type:Date,required:false},
    fecha_eliminado:{type:Date,required:false}
},{collection:'Tipos de usuarios'})

module.exports = mongoose.model('TipoUsuario',tipoUsuarioSchemam)
