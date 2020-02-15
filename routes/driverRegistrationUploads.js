// DevelapoperName: Ramachandra
// purpose of the code :Documents Uploading


// To start server
var express = require("express");
var router = express.Router();
const fs = require('fs');
//Db connection
var bodyParser = require("body-parser");
var connection = require('../connect');
router.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

var query = "UPDATE documentDetail set documentPath=?, uploadStatus='uploaded' where id=? and documentName=?";
router.post("/", function (req, res) {
    var img = req.body.image;
    var realFile = Buffer.from(img,"base64");
    var imagepath="/home/rcb/NodeProjects/AgentApp/hap-agency-back/images/"+req.body.documentName+""+req.body.driverId+".png";
    
    
    connection.beginTransaction(function (err) {
                if (err) { 
                    console.log(err);
                    res.json({
                        driverId: req.body.driverId,
                        status: "false",
                        message: "Server Problem",
                    });
            
                }
                connection.query(query,[imagepath,req.body.driverId,req.body.documentName], function (err, rows, fields) {
                    if (err && rows.affectedRows==0) {
                        return connection.rollback(function () {
                            console.log(err);
                            res.json({
                                driverId: req.body.driverId,
                                status: "false",
                                message: "data not inserted",
                            });
                            
                        });
                    }
                    fs.writeFile(imagepath, realFile, function(err) {
                        if(err){
                           console.log(err);
                           res.json({
                            driverId: req.body.driverId,
                            status: "false",
                            message: "data not inserted",
                           });
                        }
                        else{         
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                console.log(err);
                                res.json({
                                    driverId: req.body.driverId,
                                    status: "false",
                                    message: "data not inserted",
                                });
                            
                            });
                        }
                        res.json({
                            driverId: req.body.driverId,
                            status: "true",
                            message: "data inserted",
    
                        });
                    });
                }
    
                });
            });
        });
        
    });
    process.on("uncaughtException",function(err){
        console.log("Exception cought")
        console.log(err);
        });
 module.exports = router;
