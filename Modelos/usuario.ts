var mongoose = require('mongoose');

var Schema = mongoose.Schema

var UsuarioSchema = Schema({
    nombre:{type:String,required:[true,'EL nombre es requerido']},
    nick:{type:String,required:[true,'El nick es requerido']},
    password:{type:String,required:[true,'El password es requerido']},
    tipo:{type:String,required:[true,'el tipo de usuario es requerido']},
    direccion:{type:String,required:false},
    telefono:{type:String,required:false},
    token:{type:Number,required:false},
    estado:{type:Number,required:false,default:1},
    fecha_creacion:{type:Date,required:false,default:new Date().getTime()},
    fecha_modificado:{type:Date,required:false},
    fecha_eliminado:{type:Date,required:false}
},{collection:"Usuarios"} )

module.exports = mongoose.model('Usuarios',UsuarioSchema)