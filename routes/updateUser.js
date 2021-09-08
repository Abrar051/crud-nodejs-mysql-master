const express = require('express');
const router = express.Router();
const app = express();
const mysql = require('mysql2');
const cache = require('memory-cache');
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


function checkIfAuthenticated(req, res, next){
    if(!req.session.user.Id){
        console.log('No Session found')
        if (!req.session.user)//// this function is not getting session
        {
            res.render('unAuth');

        }
    }else{
        console.log('Session found')
        cache.put (req.session.user.Id,req.session.user);
        next();
    }
}


/*router.get ('/:id', checkIfAuthenticated, (request,response)=>{
    console.log('Entering session Id : '+request.session.user.Id);
    cache.put (request.session.user.Id,JSON.stringify(request.session.user));

        let query = "SELECT * from UserInfo  where Id = ? ";
        conn.query(query, [request.session.user.Id], (err, results, fields)=>{
            if(results.length ==1){

                response.render('dataUpdateForm', {
                    result: results[0]
                    //console.log (results[0]);
                });
                //console.log(results[0].User)

            }
        });

    console.log(cache.get(request.session.user.Id))

});*/



// new update style using cache
router.get ('/:id', checkIfAuthenticated, (request,response,results)=>{
    console.log('Entering session Id : '+request.session.user.Id);
    results[0]=cache.get(request.session.user.Id);
    console.log(results[0]);
    response.render('dataUpdateForm', {
        result: results[0]
    });
    console.log(cache.get(request.session.user.Id))
});









router.post ('/jsonData',(request,response)=>{
   console.log(cache.get(request.session.user.Id).Id);
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