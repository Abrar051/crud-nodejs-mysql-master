const express = require('express');
const router = express.Router();
const app = express();
const mysql = require('mysql2');
//const session = require('express-session');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'p',
    database: 'mydb'
});


const oneDay = 1000 * 60 * 60 * 24;


// Define the home page route


// Define the about route
router.get('/about', function(req, res) {
    res.send('About update');
});



router.get ('/:id',(request,response)=>{
    let id = request.params.id;
    let user = request.session.username;
    let query = "SELECT * from UserInfo  where Id = ? ";
    //console.log(request.session);
    console.log(request.session.user);
    if (!request.session.user)//// this function is not getting session
    {
        response.render('unAuth');

    }
    else
    {
        console.log(request.session);
        conn.query(query, [request.session.user.Id], (err, results, fields)=>{
            if(results.length ==1){
                //request.session.user=results[0];
                response.render('dataUpdateForm', {
                    result: results[0]
                });
            }
            //res.render('dataUpdateForm', results[0]);
            //res.json(typeof results[0])
        });
    }

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
                response.render('unAuth');
            }
        });
    }
});

module.exports = router;