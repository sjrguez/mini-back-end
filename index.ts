
// Imports
import Server from './Server/server';
import ROUTER from './Router/routers'
import cors from 'cors'

// Requires
const BODYPARSER = require( 'body-parser' )
const MONGOOSE = require('mongoose');

// Server
const SERVER = new Server()


//  BodyParse 
SERVER.APP.use(BODYPARSER.urlencoded({extended:true}))
SERVER.APP.use(BODYPARSER.json())

// CORS
SERVER.APP.use( cors({origin:true,credentials:true }) );



// Rutas
SERVER.APP.use('/usuario',ROUTER.USUARIO)
SERVER.APP.use('/login',ROUTER.LOGIN)


// Conexion a Mongo    
MONGOOSE.connect('mongodb://localhost:27017/test', {useNewUrlParser: true},(error:any,res:any)=>{
    if(error){
        throw error
    }
    console.log('Base de datos: \x1b[32m%s\x1b[0m','Online');
    

});

SERVER.start(()=>{
    console.log(`Servidor iniciando en el puerto: ${SERVER.PORT}`);
})
