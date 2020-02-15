var express = require('express');
var router = express.Router();
var db = require('../connect');
var md5 = require('md5');

router.post('/', function (req, res, next) {
     var aid = req.body.aid;
     var password = md5(req.body.password);
     console.log(password);
     
    db.query('SELECT aid,name,mobileNumber,email FROM agentRegistration WHERE aid = ? and password= ?', [aid, password], function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.json({
                userDetails: {},
                status: "false",
                message: "Server Problem"
            })
            
        }
        else if (rows.length > 0) {
            console.log(rows);
            res.json({
                userDetails: rows[0],
                status: "true",
                message: "login success",
            });
          
        }
        else {
            res.json({
                userDetails: {},
                status: "false",
                message: "login failed"
            })
        }
    })
});
process.on("uncaughtException",function(err){
    console.log("Exception cought")
    console.log(err);
    });
module.exports = router;