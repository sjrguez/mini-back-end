const JWT = require('jsonwebtoken')
const SEED = require("../Config/config").SEED
const FUNCIONES = require('../Funciones/funciones')

// Objeto de error
const ERROR={
    error:{
        error:null,
        mensaje:''
    },
    codigo:400,
}
// Token
exports.verificaToken = (req:any,res:any,next:any)=>{
    const TOKEN = req.query.token
    JWT.verify(TOKEN,SEED,(error:any,decoded:any)=>{
        if(error){
            ERROR.error.error = error
            ERROR.error.mensaje = "Token Invalido"
            ERROR.codigo = 401
            return FUNCIONES.Http_Error(res,ERROR.codigo,ERROR.error)
        }
        next()
    })
}