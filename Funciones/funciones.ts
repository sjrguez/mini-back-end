// Imports
import { isNull } from 'util';

// Requires
const USUARIO = require('../Modelos/usuario')

// Objeto de error
const ERROR={
    error:{
        error:null,
        mensaje:''
    },
    codigo:400,
}





 const verificarID = (id:any,estado:any)=>{
    return new Promise((resolve,reject)=>{
        USUARIO.findOne({estado:{$lte:estado},_id:id})
                .exec((error:any,usuarioDB:any)=>{
                    if(error){
                        ERROR.error.error = error
                        ERROR.error.mensaje = "Ha sucedido un error al verificar datos"
                        ERROR.codigo = 500
                        return reject(ERROR)
                    } 
                    if(isNull(usuarioDB)){
                         ERROR.error.error = null
                         ERROR.error.mensaje = "No existe un usuario con ese ID"
                         ERROR.codigo = 400
                         return reject(ERROR)
                    }
                    let usu={usuarioDB}
                     resolve(usu)
                })
    })
}


const VerificarCampos = (campos:any,id?:any)=>{
    return new Promise((resolve,reject)=>{
        if(id){
            campos._id={$nin:id}
        }

        USUARIO.findOne(campos)
            .exec((error:any,data:any)=>{
                   if(error){
                       ERROR.error.error = error
                       ERROR.error.mensaje = "Ha sucedido un error no se ha encontrado ID"
                       ERROR.codigo = 500
                       return reject(ERROR)
                   } 
                   if(!isNull(data)){
                        ERROR.error.error = null
                        ERROR.error.mensaje = "Este ID no existe"
                        ERROR.codigo = 404
                        return reject(ERROR)
                   }

                   resolve()
            })
    })
}


const Http_Error = (res:any,httpCode:Number,object:any)=>{
    return  new Promise((resolve,reject)=>{
        let respuestaRes = res.status(httpCode).json({
            mensaje:object.mensaje,
            error:object.error
        })

        resolve(respuestaRes)

    })
}

module.exports = {
    Http_Error,
    VerificarCampos,
    verificarID,
    ERROR
}