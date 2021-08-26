var express = require('express');
var router = express.Router();
const app = express();
const mysql = require('mysql2');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'p',
    database: 'mydb'
});


// Define the home page route
router.get('/', function(req, res) {
    res.render('login');
});

// Define the about route
router.get('/about', function(req, res) {
    res.send('About us');
});

router.post('/auth', function(request, response) {
    console.log(request.body);
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {

                //response.redirect.render('unAuth',)});
                return response.render('userProfile', {
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

module.exports = router;