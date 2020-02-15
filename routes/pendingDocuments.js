var express = require('express');
var router = express.Router();
var db = require('../connect');
// var agentId = "a1";


router.post('/', function (req, res, next) {
    var driverId = req.body.driverId;

    var query = `SELECT documentName, uploadStatus,documentPath FROM documentDetail WHERE id='${driverId}'`;
    db.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.json({
                pendingDrivers: rows,
                status: "false",
                message: "No driver available on this id ",
            });
        }
        else {
            res.json({
                pendingDrivers: rows,
                status: "true",
                message: "pending documents",
            });
        }
    })
});
process.on("uncaughtException",function(err){
    console.log("Exception cought")
    console.log(err);
    });
module.exports = router;