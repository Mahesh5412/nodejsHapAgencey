var express = require('express');
var router = express.Router();
var db = require('../connect');

router.post('/', function (req, res, next) {
    var agentId = req.body.agentId;
    var action = req.body.action

    if (action == 'uploaded') {
        var query = `SELECT dr.driverId, fullName, mobile, vehicleName,vehicleType, vehicleNo, driverStatus FROM driverRegistration dr INNER JOIN 
        documentDetail dt ON dt.id= dr.driverId INNER JOIN vehicleDetail vd ON vd.vehicleId= dr.vehicleId INNER JOIN
         driverDetail dd ON dd.driverId= dr.driverId WHERE dt.uploadStatus='uploaded' AND dr.agentId='${agentId}' GROUP BY dr.driverId HAVING COUNT(dt.documentName)=6`;

        db.query(query, function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.json({
                    driversList: {},
                    status: "false",
                    message: "no active drivers",
                });
                
            }
            else if (rows.length > 0) {
                res.json({
                    driversList: rows,
                    status: "true",
                    message: "active drivers available",
                });
            }
            else {
                res.json({
                    driversList: {},
                    status: "false",
                    message: "no active drivers",
                });
            }
        })


    }
    else {

        var query = `SELECT dr.driverId, fullName FROM driverRegistration dr INNER JOIN documentDetail dt ON dt.id= dr.driverId WHERE dt.uploadStatus='not uploaded' AND dr.agentId='${agentId}' GROUP BY dr.driverId`;

        db.query(query, function (err, rows, fields) {
            if (err) {
                res.json({
                    driversList: {},
                    status: "false",
                    message: "no pending drivers",
                });
                console.log(err);
            }
            else if (rows.length > 0) {
                res.json({
                    pendingDrivers: rows,
                    status: "true",
                    message: "pending drivers",
                });
            }
            else {
                res.json({
                    driversList: {},
                    status: "false",
                    message: "no pending drivers",
                });
            }
        })


    }


});
process.on("uncaughtException", function (err) {
    console.log("Exception cought")
    console.log(err);
});

module.exports = router;