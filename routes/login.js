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

    if (!request.session.user) {
        response.render('login');
        // request.session.count = 0;
    }
    else {
        let username = request.session.user.User;
        let password = request.session.user.Password;
        if (username && password) {
            conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], function (error, results, fields) {
                if (results.length > 0) {

                    //response.redirect.render('unAuth',)});
                    return response.render('userProfile', {
                        results: results
                    });

                }
            });
        }

    }

    /*else if (request.session.count == 1) {
        //session.destroy();
        response.render('login');
    }*/
    request.session.count += 1;

    // respond with the session object

});

// Define the about route
router.post('/auth', function(request, response) {
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



router.get ('/unAuth',function (request,response){
    response.render('unAuth');
});





module.exports = router;