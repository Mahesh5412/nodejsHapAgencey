var express = require('express');
var router = express.Router();
var db = require('../connect');


router.post('/', function (req, res, next) {
    var mobileNumber = req.body.mobileNumber;
    var newPassword = req.body.newPassword;
    var action = req.body.action;
    var Otp = req.body.otp
    if (action == "verify") {
        var query = `SELECT otp FROM agentRegistration WHERE mobileNumber='${mobileNumber}'`;
        db.query(query, function (err, result, fields) {
            if (Otp == result[0].otp) {
                res.json({
                    message: "verified",
                    status: "true"
                });
            }
            else {
                res.json({
                    message: "invalid otp",
                    status: "false"
                });

            }
        }
        )
    }
    else if(action=="update") {
        var query = `Update  agentRegistration set password='${newPassword}' WHERE mobileNumber='${mobileNumber}'`;
        db.query(query, function (err, result, fields) {

            if (err) {
                res.json({
                    status: 'false',
                    message: "something went wrong"
                });
            }
            else {
                res.json({
                    message: "succesfully updated",
                    status: "true"
                });
            }
        });
    }
    else{
        res.json({
            message: "Please enter correct otp or another phone number",
            status: "false"
        }); 
    }

});
process.on("uncaughtException",function(err){
    console.log("Exception cought")
    console.log(err);
    });
module.exports = router;