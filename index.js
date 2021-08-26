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
const indexRouter3 = require('./routes/updateUser');
const indexRouter4 = require('./routes/deleteUser');
// const usersRouter = require('./routes/users');

// app.get('/test/', customRoute);

app.use('/test', indexRouter);
app.use('/register',indexRouter1);
app.use('/login',indexRouter2);
app.use('/update',indexRouter3);
app.use('/delete',indexRouter4);
app.use('/authenticate',indexRouterAuthenticate);

// app.use('/users', usersRouter);
/*app.get('/',(req, res) => {
  let sql = "SELECT * FROM UserInfo";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('login',{
      results: results
    });
  });
});*/
////opening page



//// login option
app.post('/login');
app.post('/auth');
app.post('/register');
app.post('/register/');



/*
app.get('/', function(request, response) {
  response.render('login');
});
//authorize
app.post('/auth', function(request, response) {
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
*/





/////
///register
/*app.post('/register', function(request, response) {
  response.render('registration');
});*/



//input registration data on database
/*app.post ('/successfulRegister',function (request,response) {
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
});*/













//if username and pass is wrong go here
app.get('/unAuth',(req, res) => {

  res.render('unAuth',)});


//rendering update page
app.get ('/updateProfile',(req,res)=>{
  res.render('dataUpdateForm');
});


////rendering registration page

app.get ('/registration',(req,res)=>{
  res.render('registration');
});


/// delete user data

app.get ('/deletePage',(req,res)=>{
  res.render('deleteUser');
});


///get username and pass then update database with profile

app.post('/updatePage', function(request, response){
  console.log(request.body);
  let username = request.body.username;
  let password = request.body.password;
  let usertype = request.body.type;
  let age = request.body.age;
  let height = request.body.height;
  let gender = request.body.gender;
  if (username && password) {
    conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], (error, results, fields) =>{

      if (results.length > 0) {
        conn.query('UPDATE UserInfo SET User_Type= ? , Age=? , Height=? , Gender=? WHERE User=? AND Password=?',[usertype,age,height,gender,username,password], (error,results,fields)=>{

          conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
              return response.render('userProfile', {
                results: results
              });
            }
          });
        });

      } else {
        response.redirect('unAuth');
      }
    });
  }
});

////update done


///delete user
app.post ('/deletePage',(request,respond)=> {
  console.log(request.body);
  let username = request.body.username;
  let password = request.body.password;
  if (username && password) {
    conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], (error, results, fields) => {

      if (results.length > 0) {
        conn.query('DELETE FROM UserInfo WHERE USER =? AND Password=?', [username,password], (error, results, fields) => {
          respond.render('deletePage');
        });

      } else {
        respond.redirect('unAuth');
      }
    });
  }
});














app.get('/profileView',(req, res) => {

  conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?',
      [username, password], function(error, results, fields) {
        User_Type=req.body.User_Type;
        Age=req.body.Age;

      });
  res.render('userProfile');
});

//update profile








app.get('/productList',(req, res) => {
  let sql = "SELECT * FROM product";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});

app.post('/save',(req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

app.get('/save',(req, res) => {
  // let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  // let sql = "INSERT INTO product SET ?";
  // let query = conn.query(sql, data,(err, results) => {
  //   if(err) throw err;
  res.redirect('/');
  // });
});


app.post('/update',(req, res) => {
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});


app.post('/delete',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});


app.listen(8000, () => {
  console.log('Server is running at port 8000');
});