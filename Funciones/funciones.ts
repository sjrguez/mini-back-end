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





 const verificarID = (modelo:any,id:any,estado:any)=>{
    return new Promise((resolve,reject)=>{
        modelo.findOne({estado:{$lte:estado},_id:id})
                .exec((error:any,modeloDB:any)=>{
                    if(error){
                        ERROR.error.error = error
                        ERROR.error.mensaje = "Ha sucedido un error al verificar datos"
                        ERROR.codigo = 500
                        return reject(ERROR)
                    } 

                    let usu={modeloDB}
                     resolve(usu)
                })
    })
}


const VerificarCampos = (modelo:any,campos:any,id?:any)=>{
    return new Promise((resolve,reject)=>{
        if(id){
            campos._id={$nin:id}
        }

        modelo.findOne(campos)
            .exec((error:any,data:any)=>{
                   if(error){
                       ERROR.error.error = error
                       ERROR.error.mensaje = "Ha sucedido un error al verificar campos"
                       ERROR.codigo = 500
                       return reject(ERROR)
                   } 
                   if(!isNull(data)){
                        ERROR.error.error = null
                        ERROR.error.mensaje = "Existe ese nombre"
                        ERROR.codigo = 404
                        return reject(ERROR)
                   }
                   resolve()
            })
    })
}


const Http_Error = (res:any,httpCode:Number,object:any)=>{
    console.log(object);
    
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