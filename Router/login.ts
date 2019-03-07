import { Router,Request,Response } from 'express';
import { isNull } from 'util';

const ROUTER = Router()
const USUARIO = require('../Modelos/usuario')
const bcrypt = require('bcrypt');
const FUNCIONES = require('../Funciones/funciones')
const ERROR_MENSAJE = FUNCIONES.ERROR


ROUTER.post('/',(req:Request,res:Response)=>{
    const BODY = req.body
    
    USUARIO.findOne({estado:1,nick:BODY.nick})
                .exec((error:any,usuarioDB:any)=>{
                    ERROR_MENSAJE.error.error = null
                    ERROR_MENSAJE.error.mensaje = 'Usuario y/o contraseña incorrecto.'
                    ERROR_MENSAJE.codigo = 404

                    if(error){
                        ERROR_MENSAJE.error.error = error
                        ERROR_MENSAJE.error.mensaje = 'Ha sucedido un error al identificar usuario'
                        ERROR_MENSAJE.codigo = 500
                        return FUNCIONES.Http_Error(res,ERROR_MENSAJE.codigo,ERROR_MENSAJE.error)
                    }
                
                    if(isNull(usuarioDB)){
                        return FUNCIONES.Http_Error(res,ERROR_MENSAJE.codigo,ERROR_MENSAJE.error)
                    }

                    if (usuarioDB.estado == 3 || usuarioDB.estado == 2) {
                        ERROR_MENSAJE.codigo = 401
                        return FUNCIONES.Http_Error(res,ERROR_MENSAJE.codigo,ERROR_MENSAJE.error)
                    }

                    if(!bcrypt.compareSync(BODY.password,usuarioDB.password)){
                        return FUNCIONES.Http_Error(res,ERROR_MENSAJE.codigo,ERROR_MENSAJE.error)
                    }

                    res.json({
                        ok:true,
                        data:usuarioDB
                    })

                })
})


module.exports =  ROUTER
