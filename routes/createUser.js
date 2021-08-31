var express = require('express');
var router = express.Router();
const app = express();
const mysql = require('mysql2');
const session = require('express-session');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'p',
    database: 'mydb'
});



// Define the home page route
router.get('/create', function(req, res) {
    res.json('Create User');
});

// Define the about route
router.get('/about', function(req, res) {
    res.send('About User');
});

router.post('/', function(request, response) {
    response.render('registration');
});

router.post ('/successfulRegister',function (request,response) {
    console.log(request.body);
    let username = request.body.username;
    let password = request.body.password;
    let usertype = request.body.type;
    let age = request.body.age;
    let height = request.body.height;
    let gender = request.body.gender;

    conn.query('INSERT INTO UserInfo SET User =?,Password=?,User_Type=?,Age=?,Gender=?,Height=?', [username, password,usertype,age,gender,height], function(error, results, fields) {
        console.log(results);
        // if (results.length()>0){
        conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                return response.render('userProfile', {
                    results: results
                });
            }
        });
        //}

    });
});

module.exports = router;