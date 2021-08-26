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


// Define the about route
router.get('/about', function(req, res) {
    res.send('About update');
});

router.get ('/',(req,res)=>{
    res.render('dataUpdateForm');
});

router.post('/updatePage', function(request, response){
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

module.exports = router;