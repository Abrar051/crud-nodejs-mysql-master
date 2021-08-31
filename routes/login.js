var express = require('express');
const app = express();
const mysql = require('mysql2');
// let session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const item = require("session-storage")
const sessionStorage = require('session-storage');


var router = express.Router();
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'p',
    database: 'mydb'
});


const oneDay = 1000 * 60 * 60 * 24;

let session = require('express-session')({

    name: '_es_demo', // The name of the cookie
    secret: '1234', // The secret is required, and is used for signing cookies
    cookie: { maxAge: oneDay },
    resave: false, // Force save of session for each request.
    saveUninitialized: true // Save a session that is new, but has not been modified
})
app.use(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
//router(app);
// let session = require('express-session');

// Define the home page route
router.get('/',  function(request, response) {
    //check if session found
    //if found
    let username=session.user;
    let password=session.pass;
    let id = session.sessionId;
    console.log(session);
        if (session.user && session.pass) {
            conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], function (error, results, fields) {
                return response.render('userProfile', {
                    results: results
                });
            });
        }
    else
    {
        response.render('login');
    }
});

// Define the about route
router.post('/auth',session, function(request, response) {
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
                session=request.session;
                request.session.loggedin = true;
                session.user=request.body.username;
                session.pass=request.body.password;
                session.browserId = session.sessionId;
                console.log(session.pass);
                console.log(session.user);
                console.log(session);
                console.log(session.count);
                session.count++;
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



router.get ('/unAuth',function (request,response){
    response.render('unAuth');
});





module.exports = router;