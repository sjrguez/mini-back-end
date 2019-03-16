import { Router, Request, Response, response } from 'express';
import { isNull } from 'util';
import { NextFunction } from 'connect';

const ROUTER = Router()
const USUARIO = require('../Modelos/usuario')
const BCRYPT = require('bcrypt');
const AUTENTICAR = require('../Middleware/autentificacion')

const FUNCIONES = require('../Funciones/funciones')


// Objeto de error
const ERROR={
    error:{
        error:null,
        mensaje:''
    },
    codigo:400,
}

// Mostrar usuarios
ROUTER.get('/',(req:Request,res:Response)=>{
        
    USUARIO.find({estado:{$lt:3}})
            .sort({_id:-1})
            .populate('tipo','nombre')
            .exec((error:any,usuarioDB:Array<Object>)=>{
                if(error){
                    ERROR.error.error = error
                    ERROR.error.mensaje = "Ha sucedido un error al mostrar usuarios"
                    ERROR.codigo = 500
                    return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
                }
                
                res.json({
                    ok:true,
                    data:usuarioDB
                })
            })
})




// Registrar usuario
ROUTER.post('/',AUTENTICAR.verificaToken,(req:Request,res:Response)=>{
    const BODY  = req.body
    
    FUNCIONES.VerificarCampos(USUARIO,{nick:BODY.nick,estado:1})
    .then(()=>{
        let usuario =  new USUARIO({
            nombre:BODY.nombre,
            nick: BODY.nick,
            password: BCRYPT.hashSync(BODY.password, 10),
            tipo:BODY.tipo,
            telefono:BODY.telefono,
            direccion:BODY.direccion
        })
        
        usuario.save((error:any,usuarioGuardado:any)=>{
            if(error){
                ERROR.error.error = error
                ERROR.error.mensaje = "Ha sucedido un error al registrar usuario"
                ERROR.codigo = 500
                return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
            }
            res.json({
                ok:true,
                data:usuarioGuardado,
                mensaje:'Se ha guardado correctamente'
            })
        })
    }).catch((error:any)=>FUNCIONES.Http_Error(res,error.codigo,error.error))
})

// Traer usuario
ROUTER.get('/:id',AUTENTICAR.verificaToken,(req:Request,res:Response)=>{
    const ID = req.params.id
    FUNCIONES.verificarID(USUARIO,ID,1).then((usu:any)=>{
        if(isNull(usu.modeloDB)){
            ERROR.error.error = null
            ERROR.error.mensaje = "No existe este usuario"
            ERROR.codigo = 404
            throw  ERROR
        }
        let usuario =  usu.modeloDB
         usuario.password = ''
        res.json({
            ok:true,
            data:usuario
        })
    
    }).catch((error:any)=>FUNCIONES.Http_Error(res,error.codigo,error.error))

})

// Modificar usuario

ROUTER.put('/:id',AUTENTICAR.verificaToken,(req:Request,res:Response)=>{
    const ID = req.params.id
    const BODY = req.body
    let usuario:any
    FUNCIONES.verificarID(USUARIO,ID,2).then((usu:any)=>{
        if(isNull(usu.modeloDB)){
            ERROR.error.error = null
            ERROR.error.mensaje = "No existe este usuario"
            ERROR.codigo = 404
            throw  ERROR
        }
        const DATA={nick:BODY.nick,estado:1}
        usuario = usu.modeloDB
        return FUNCIONES.VerificarCampos(USUARIO,DATA,ID)        
    }).then(()=>{
        usuario.nombre = BODY.nombre
        usuario.nick = BODY.nick
        usuario.tipo = BODY.tipo
        usuario.telefono = BODY.telefono
        usuario.direccion = BODY.direccion
        usuario.estado = BODY.estado
        usuario.password = BCRYPT.hashSync(BODY.password, 10) 
        usuario.fecha_modificado = new Date().getTime()
         usuario.save((error:any,usuarioDB:any)=>{
            if(error){
                ERROR.error.error = error
                ERROR.error.mensaje = "Ha sucedido un error al modificar usuario"
                ERROR.codigo = 500
                return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
            } 
            res.json({
                ok:true,
                data:usuarioDB,
                mensaje:'Se ha modificado correctamente'
            })
         })

    }).catch((error:any)=>FUNCIONES.Http_Error(res,error.codigo,error.error))
})



// Eliminar usuario
ROUTER.delete('/:id',AUTENTICAR.verificaToken,(req:Request,res:Response)=>{
    const ID = req.params.id
    FUNCIONES.verificarID(USUARIO,ID,2).then((data:any)=>{
        if(isNull(data.modeloDB)){
            ERROR.error.error = null
            ERROR.error.mensaje = "No existe este usuario"
            ERROR.codigo = 404
            throw  ERROR
        }
        const USU =  data.modeloDB
            
        USU.estado = 3
        USU.fecha_eliminado = new Date().getTime()
        USU.save((error:any,usuarioDB:any)=>{
            if(error){
                ERROR.error.error = error
                ERROR.error.mensaje = "Ha sucedido un error al eliminar usuario"
                ERROR.codigo = 500
                FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
            } 
            res.json({
                ok:true,
                data:usuarioDB,
                mensaje:'Se ha elimiando correctamente'
            })
        })
    }).catch((error:any)=>FUNCIONES.Http_Error(res,error.codigo,error.error))
})

// Cmbiar password
ROUTER.put('/cambiarPass/:id',(req:Request,res:Response)=>{
    const ID = req.params.id
    const PASS = req.body.password
    FUNCIONES.verificarID(USUARIO,ID,1).then((usu:any)=>{
        if(isNull(usu.modeloDB)){
            ERROR.error.error = null
            ERROR.error.mensaje = "No existe este usuario"
            ERROR.codigo = 404
            throw  ERROR
        }
        let usuario = usu.modeloDB
        
        usuario.password =  BCRYPT.hashSync(PASS, 10)
        usuario.save((error:any,usuarioDB:any)=>{
            if(error){
                ERROR.error.error = error
                ERROR.error.mensaje = "Ha sucedido un error al modificar password "
                ERROR.codigo = 500
                return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
            } 
            res.json({
                ok:true,
                data:usuarioDB,
                mensaje:'Se ha modificado correctamente el password'
            })
        })
    })
})


// Buscar usuario
ROUTER.post('/buscar',AUTENTICAR.verificaToken,(req:Request,res:Response)=>{
        const BODY =  req.body
        let nombre = {nombre:new RegExp(BODY.nombre, 'i'),estado:1};
        
        USUARIO.find({$or:[nombre]})
                .sort({_id:-1})
                .populate('tipo','nombre')
                .exec((error:any,usuarioDB:Array<object>)=>{
                    if(error){
                        ERROR.error.error = error
                        ERROR.error.mensaje = "Ha sucedido un error al buscar usuarios "
                        ERROR.codigo = 500
                       return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
                    } 
                    res.json({
                        ok:true,
                        data:usuarioDB
                    })
                })
})

// Funciones


module.exports =  ROUTER