const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'p',
  database: 'mydb'
});

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
const indexRouter1 = require('./routes/createUser');
const indexRouter2 = require('./routes/login');
const indexRouterAuthenticate =require('./routes/authenticate');
const updateRouter = require('./routes/updateUser');
const indexRouter4 = require('./routes/deleteUser');

app.use('/test', indexRouter);
app.use('/register',indexRouter1);
app.use('/login',indexRouter2);
app.use('/update',updateRouter);
app.use('/delete',indexRouter4);
app.use('/authenticate',indexRouterAuthenticate);

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