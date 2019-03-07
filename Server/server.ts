import express from 'express';


export default class Server{
    
    public APP:express.Application
    public PORT:Number
    

    constructor(){
        this.APP = express()
        this.PORT = 5000 
    }


    start(callback:Function){
        this.APP.listen(this.PORT,callback)
    }


}