import { Router, Request, Response, response } from 'express';
import { isNull } from 'util';

const ROUTER = Router()
const TIPOUSUARIO = require('../Modelos/tipousuario')
const USUARIO = require('../Modelos/usuario')

const FUNCIONES = require('../Funciones/funciones')

// Objeto de error
const ERROR={
    error:{
        error:null,
        mensaje:''
    },
    codigo:400,
}


// Mostrar tipos de usuarios

ROUTER.get('/',(req:Request,res:Response)=>{
    TIPOUSUARIO.find({estado:1})
            .sort({_id:-1})
            .exec((error:any,tipoDB:any)=>{
                if(error){
                    ERROR.error.error = error
                    ERROR.error.mensaje = "Ha sucedido un error al mostrar tipos de usuarios"
                    ERROR.codigo = 500
                    return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
                }
                res.status(200).json({
                    ok:true,
                    data:tipoDB
                })
            })
})


// Registrar tipo de usuario
ROUTER.post('/',(req:Request,res:Response)=>{
    const BODY =  req.body
    FUNCIONES.VerificarCampos(TIPOUSUARIO,{nombre:BODY.nombre,estado:1})
    .then(()=>{
        let tipo = new TIPOUSUARIO({
            nombre:BODY.nombre
        })
        tipo.save((error:any,tipoDB:any)=>{
            if(error){
                ERROR.error.error = error
                ERROR.error.mensaje = "Ha sucedido un error al guardar tipo de usuario"
                ERROR.codigo = 500
                return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
            }
            
            res.status(201).json({
                ok:true,
                data:tipoDB,
                mensaje:"Se ha guardado correctamente"
            })
        })
    }).catch((error:any)=>FUNCIONES.Http_Error(res,error.codigo,error.error))
})

// Modificar tipo de usuario

ROUTER.put('/:id',(req:Request,res:Response)=>{
    const ID = req.params.id
    const BODY = req.body
    let tipo:any
    
    FUNCIONES.verificarID(TIPOUSUARIO,ID,1)
    .then((data:any)=>{
        if(isNull(data.modeloDB)){
            ERROR.error.error = null
            ERROR.error.mensaje = "No existe un usuario con ese ID"
            ERROR.codigo = 404
            throw ERROR
         }
        tipo = data.modeloDB
        return FUNCIONES.VerificarCampos({nombre:BODY.nombre,estado:1},ID)
    }).then(()=>{
        tipo.nombre = BODY.nombre
        tipo.fecha_modificado = new Date().getTime()
        tipo.save((error:any,tipoDB:any)=>{
            if(error){
                ERROR.error.error = error
                ERROR.error.mensaje = "Ha sucedido un error al modificar tipo de usuario"
                ERROR.codigo = 500
                return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
            }
            res.json({
                ok:true,
                data:tipo,
                mensaje:'Se ha actualizado correctamente '
            })

        })

    }).catch((error:any)=>FUNCIONES.Http_Error(res,error.codigo,error.error))
})


// Eliminar tipo de usuario

ROUTER.delete('/:id',(req:Request,res:Response)=>{
    const ID = req.params.id
    FUNCIONES.verificarID(USUARIO,ID,2)
    .then((data:any)=>{
        if(!isNull(data.modeloDB)){
            ERROR.error.error = null
            ERROR.error.mensaje = "Este tipo de usuario esta en uso!"
            ERROR.codigo = 403
            throw  ERROR
        }
        
        TIPOUSUARIO.findOne({_id:ID})
        .exec((error:any,tipoDB:any)=>{
            if(error){
                ERROR.error.error = error
                ERROR.error.mensaje = "Ha sucedido un error al eliminar tipo de usuario"
                ERROR.codigo = 500
                return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
            }
            tipoDB.estado = 2
            tipoDB.fecha_eliminado = new Date().getTime()
            res.status(200).json({
                ok:true,
                mensaje:'Se ha elimiado correctamente'
            })
        })
    }).catch((error:any)=>FUNCIONES.Http_Error(res,error.codigo,error.error))
})


// Buscar tipo de usuario

ROUTER.post('/buscar',(req:Request,res:Response)=>{
    const BODY = req.body

    const NOMBRE = {nombre:new RegExp(BODY.nombre, 'i'),estado:1};
    
    TIPOUSUARIO.find({$or:[NOMBRE]})
                .exec((error:any,tipoDB:any)=>{
                    if(error){
                        ERROR.error.error = error
                        ERROR.error.mensaje = "Ha sucedido un error al buscar tipos de usuarios"
                        ERROR.codigo = 500
                        return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
                    }
                    
                    res.json({
                        ok:true,
                        data:tipoDB
                    })
                })
})



module.exports =  ROUTER