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
    resave: false, // Force save of session for each request.
    saveUninitialized: false // Save a session that is new, but has not been modified

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
router.get('/',session,  function(req, res) {
    //let session=req.session;
    // console.log(session.count);
    if (!req.session.user) {
        req.session.user = {
            'username': result.userName;
        };
    }
    req.session.count += 1;

    // send info as json
    res.json(req.session.count);
    //res.render('login');
});

// Define the about route
router.post('/auth', function(request, response) {
    console.log(request.body);
    let username = request.body.username;
    let password = request.body.password;
    let userInfo = {
        user:this.username,
        pass:this.pass,
    }
    if (username && password) {
        conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {

                //response.redirect.render('unAuth',)});
                //request.session.loggedin = true;
                //this.user.username=username;
                //request.session.username = username;
                session=request.session;
                //session.user=request.body.username;
                //session.pass=request.body.password;
                console.log(session);
                return response.render('userProfile', {
                    //storage:item(username,password),
                    //sessionStorage:session.username=username,
                    //request:sessionStorage,
                    //window:sessionStorage.setItem(username,password),
                    //window:localStorage.setItem("data",JSON.stringify(userInfo)),
                    results: results

                });

            } else {
                response.redirect('unAuth');

            }
            response.end();
        });
    } else {
        response.send('Please enter valid Username and Password!');
        response.end();
    }
});

router.get ('/unAuth',function (request,response){
    response.render('unAuth');
});

module.exports = router;