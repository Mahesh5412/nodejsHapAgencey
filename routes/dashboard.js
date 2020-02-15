var express = require('express');
var router = express.Router();
var db = require('../connect');
// var agentId = "a1";


router.post('/', function (req, res, next) {
    var agentId = req.body.agentId;

    var activeQuery = "SELECT COUNT(DISTINCT dr.driverId) active FROM driverRegistration dr INNER JOIN documentDetail \
                        dt ON dt.id= dr.driverId INNER JOIN driverDetail dd ON dd.driverId= dr.driverId WHERE dt.uploadStatus='uploaded' \
                        AND dr.agentId=? AND dd.driverStatus='online' HAVING COUNT(dt.documentName)=6 ";
                        
    var inactiveQuery="SELECT COUNT(DISTINCT dr.driverId) inActive FROM driverRegistration dr INNER JOIN documentDetail \
                        dt ON dt.id= dr.driverId INNER JOIN driverDetail dd ON dd.driverId= dr.driverId WHERE dt.uploadStatus='uploaded' AND \
                        dr.agentId=? AND dd.driverStatus='offline' HAVING COUNT(dt.documentName)=6 ";
        db.query(activeQuery,agentId, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.json({
                dashboardDetails: {
                },
                status: "false",
                message: "No Drivers Available",
            });
        }
        else {
            db.query(inactiveQuery,agentId, function (err, rows2, fields) {
                if (err) {
                    console.log(err);
                    res.json({
                        dashboardDetails: {
                        },
                        status: "false",
                        message: "No Drivers Available",
                    });
                }
                else {

            res.json({
                dashboardDetails: {
                    activeDrivers: rows[0].active,
                    pendingDrivers: rows2[0].inActive,
                },
                status: "true",
                message: "success",
            });
          }
        });
        }
    })
});
process.on("uncaughtException",function(err){
    console.log("Exception cought")
    console.log(err);
    });
module.exports = router;