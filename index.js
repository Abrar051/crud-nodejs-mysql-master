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


/*app.get('/',(req, res) => {
  let sql = "SELECT * FROM UserInfo";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('login',{
      results: results
    });
  });
});*/
//// changing here for login
app.get('/', function(request, response) {
  response.render('login');
});

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
    response.send('Please enter Username and Password!');
    response.end();
  }
});
/////

//if username and pass is wrong go here
app.get('/unAuth',(req, res) => {

  res.render('unAuth',)});


//rendering update page
app.get ('/updateProfile',(req,res)=>{
  res.render('dataUpdateForm');
});

///get username and pass then update database with profile

app.post('/updatePage', function(request, response){
  console.log(request.body);
  let username = request.body.username;
  let password = request.body.password;
  let usertype = request.body.type;
  let age = request.body.age;
  let height = request.body.height;
  if (username && password) {
    conn.query('SELECT * FROM UserInfo WHERE USER = ? AND Password = ?', [username, password], (error, results, fields) =>{

      if (results.length > 0) {
        conn.query('UPDATE UserInfo SET User_Type= ? , Age=? , Height=? WHERE User=? AND Password=?',[usertype,age,height,username,password], (error,results,fields)=>{

          return response.render('userProfile', {
            results: results
          });
        });

      } else {
        response.redirect('unAuth');
      }
      //response.end();
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