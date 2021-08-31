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



//Middle ware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });


// Define the home page route
// Define the about route
router.get('/about', function(req, res) {
    res.send('About deleting');
});
router.get ('/',(req,res)=>{
    res.render('deleteUser');
});
router.post ('/deletePage',(request,respond)=> {
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
                respond.render('unAuth');
            }
        });
    }
});


module.exports = router;