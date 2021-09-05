const express = require('express');
const app = express();
const mysql = require('mysql2');
// let session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const redis = require('redis');
const client = redis.createClient();
const redisStore = require('connect-redis')(session);
const router = express.Router();
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



router.get('/', (request, response) => {
    request.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        response.render('login');
    });
});


module.exports = router;