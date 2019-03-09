import { Router, Request, Response, response } from 'express';
import { isNull } from 'util';

const ROUTER = Router()
const USUARIO = require('../Modelos/usuario')
const bcrypt = require('bcrypt');

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
ROUTER.post('/',(req:Request,res:Response)=>{
    const BODY  = req.body
    
    FUNCIONES.VerificarCampos({nick:BODY.nick,estado:1})
    .then(()=>{

        let usuario =  new USUARIO({
            nombre:BODY.nombre,
            nick: BODY.nick,
            password: bcrypt.hashSync(BODY.password, 10),
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
ROUTER.get('/:id',(req:Request,res:Response)=>{
    const ID = req.params.id
    FUNCIONES.verificarID(ID,1).then((usu:any)=>{
        let usuario =  usu.usuarioDB
         usuario.password = ':)'
        res.json({
            ok:true,
            data:usuario
        })
    
    }).catch((error:any)=>FUNCIONES.Http_Error(res,error.codigo,error.error))

})

// Modificar usuario

ROUTER.put('/:id',(req:Request,res:Response)=>{
    const ID = req.params.id
    const BODY = req.body
    let usuario:any
    FUNCIONES.verificarID(ID,2).then((usu:any)=>{
        
        const DATA={nick:BODY.nick,estado:1}
        usuario = usu.usuarioDB
        return FUNCIONES.VerificarCampos(DATA,ID)        
    }).then(()=>{
        usuario.nombre = BODY.nombre
        usuario.nick = BODY.nick
        usuario.tipo = BODY.tipo
        usuario.telefono = BODY.telefono
        usuario.direccion = BODY.direccion
        usuario.estado = BODY.estado
        usuario.password = bcrypt.hashSync(BODY.password, 10) 
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
ROUTER.delete('/:id',(req:Request,res:Response)=>{
    const ID = req.params.id
    FUNCIONES.verificarID(ID,2).then((data:any)=>{
        const USU =  data.usuarioDB
            
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
    FUNCIONES.verificarID(ID,1).then((usu:any)=>{
        let usuario = usu.usuarioDB
        
        usuario.password =  bcrypt.hashSync(PASS, 10)
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
ROUTER.post('/buscar',(req:Request,res:Response)=>{
        const BODY =  req.body
        let nombre = {nombre:new RegExp(BODY.nombre, 'i'),estado:1};
        console.log(nombre);
        
        USUARIO.find({$or:[nombre]})
                .sort({_id:-1})
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