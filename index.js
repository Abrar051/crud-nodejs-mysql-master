const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
//const session = require('express-session');
const cookieParser = require("cookie-parser");
const item = require("session-storage")
const sessionStorage = require('session-storage');
const session = require('express-session');
const redis = require('redis');
const client = redis.createClient();
const redisStore = require('connect-redis')(session);



var conn = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'p',
  database: 'mydb'
});




/*let session = require('express-session')({

  name: '_es_demo', // The name of the cookie
  secret: '1234', // The secret is required, and is used for signing cookies
  resave: false, // Force save of session for each request.
  saveUninitialized: false // Save a session that is new, but has not been modified
})*/



////use this if putting session on redis store


app.use(session({
  store: new redisStore({ client: client }),
  secret: 'topsecret~!@#$%^&*',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true,
    secure: false,
    httpOnly: false,
    maxAge: 1000 * 60 * 10 // 10 minutes
  }
}))





//app.use(session);
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected');
});

app.set('views',path.join(__dirname,'views'));

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/assets',express.static(__dirname + '/public'));


const indexRouter = require('./routes/userRoutes');
const routerCreateUser = require('./routes/createUser');
const routerLogin = require('./routes/login');
const indexRouterAuthenticate =require('./routes/authenticate');
const routerUpdate = require('./routes/updateUser');
const routerDelete = require('./routes/deleteUser');
const routerLogout = require('./routes/logout');


app.use('/test', indexRouter);
app.use('/register',routerCreateUser);
app.use('/login',routerLogin);
app.use('/update',routerUpdate);
app.use('/delete',routerDelete);
app.use('/authenticate',indexRouterAuthenticate);
app.use('/update',routerUpdate);
app.use('/logout',routerLogout);

// app.post('/login');
// app.post('/auth');
// app.post('/register');
// app.post('/successfulRegister');
// app.post('/update');
// app.post ('/delete');
// app.post('/delete/deletePage');



app.listen(8000, () => {
  console.log('Server is running at port 8000');
});