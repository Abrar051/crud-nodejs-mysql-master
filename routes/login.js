const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const redis = require('redis');
const client = redis.createClient();
const request = require('request');
const cachedRequest = require('cached-request');
const cacheDirectory = "/tmp/cache";
const redisStore = require('connect-redis')(session);
const nodeCache = require( "node-cache" );
const myCache = new nodeCache( { stdTTL: 100, checkperiod: 120 });
const cache = require('memory-cache');

var router = express.Router();
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'p',
    database: 'mydb'
});


const oneDay = 1000 * 60 * 60 * 24;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
//router(app);
// let session = require('express-session');



client.on('connect', function (err) {
    if (err) {
        console.log('Could not establish a connection with Redis. ' + err);
    } else {
        console.log('Connected to Redis successfully!');
    }
});





// Define the home page route







////////////cache redis system




function checkIfAuthenticated (req, res, next){
    if(!req.session.user){
        console.log('No user session found');
        if (!req.session.user)//// this function is not getting session
        {
            res.render('login');
        }
    }else{
        console.log('User session found');
        console.log(req.session.user);
        cache.put(req.session.user.Id,req.session.user);
        console.log (cache.get(req.session.user.Id));
        next();
    }
}



function dataInRedis (request , response, next){

}





router.get('/', checkIfAuthenticated, function(request, response) {
    //check if session found

        let username = request.session.user.User;
        let password = request.session.user.Password;
        if (username && password) {
            conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], function (error, results, fields) {
                if (results.length > 0) {
                    return response.render('userProfile', {
                        results: results
                    });
                }
            });
        }
    request.session.count += 1;
});



router.get('/cached-users', (req, res) => {
    if (req.session.user==null)
    {
        console.log('No user found');
        res.render('unAuth');
    }
    else
    {
        console.log(cache.get(req.session.user.Id));
    }


});






// Define the about route
router.post('/auth',function(request, response) {
    console.log(request.body);
    let username = request.body.username;
    let password = request.body.password;
    let browserId = request.sessionId;
    let userInfo = {
        user:this.username,
        pass:this.pass,
    }
    if (username && password) {
        conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                //session=request.session;
                request.session.user = results[0];
                return response.render('userProfile', {
                    results: results,
                });
            } else {
                response.redirect('unAuth');
            }
            response.end();
        });
    }

    else {
        response.send('Please enter valid Username and Password!');
        response.end();
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/')
    });
});

router.get ('/unAuth',function (request,response){
    response.render('unAuth');
});





module.exports = router;