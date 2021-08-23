const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const req = require("express");
const app = express();


const conn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'p',
    database: 'mydb'
});


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
    console.log(request.body);
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                //request.session.loggedin = true;
                //request.session.username = username;
                response.redirect('/');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.listen(4000);