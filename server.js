const express= require('express');
const bodyParser= require('body-parser');
let jwt= require('jsonwebtoken');
let config= require('./config');
let middleware= require('./middleware');

class HandlerGenerator{
    login(req,res){
        let username= req.body.username;
        let password =req.body.password;

        //for given username fetch user from database

        let mockedUsername ='admin';
        let mockedPassword ='password';

        if(username && password){
            if(username === mockedUsername && password=== mockedPassword){
                let token =jwt.sign({username: username},
                    config.secret,
                    {expiresIn: '24h'} //token expires in 24 hours
                    );
                res.json({
                    success: true,
                    message: 'Authentication successful!!',
                    toek: token
                });
            }
            else{
                res.send(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        }
        else{
            res.send(400).json({
                success: false,
                message: 'Authentiation failed please check the request'
            });
        }
    }
    index(req,res){
        res.json({
            success: true,
            message: 'Index Page'
        });
    }
}

function main(){
    let app= express();//export app for other routes
    let handlers= new HandlerGenerator();
    const port =process.env.PORT || 8000;
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.post('/login',handlers.login);
    app.get('/',middlesware.checkToken,handlers.index);
    app.listen(port,()=> console.log('Server is listening on port: ${port}'));

}
main();