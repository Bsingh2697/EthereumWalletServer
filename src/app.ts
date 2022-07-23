import express, {Application, Request, Response, NextFunction} from 'express';

const app: Application = express();

app.get('/',(req:Request,res:Response, next:NextFunction) =>{
    res.send('Hello WELCOME');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("Server running"));
