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


module.exports = router;