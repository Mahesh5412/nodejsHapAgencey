var express = require('express');
var router = express.Router();
var connection = require('../connect');

router.post('/', function (req, res, next) {
     //randM NUMBER GENERAting
     function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    var vehtype=req.body.vehicleType;
    console.log(vehtype);

    var rString = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyz');
    var driverId='d'+rString;
    console.log(driverId);
    //===============================Current Date===============================
    var d = new Date();
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

    var regdate = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    //========================================================================================
    var query = "INSERT INTO `vehicleDetail`(vehicleNo, seatCount,vehicleType) VALUES (?,?,?)";
    var query1 = "INSERT INTO `driverRegistration`(agentId,driverId, fullName, mobile,regDate, vehicleId)VALUES (?,?,?,?,?, (SELECT vehicleId FROM vehicleDetail WHERE vehicleNo=?))";
    var query2 = "INSERT INTO `documentDetail`(id, documentName, documentNo) VALUES (?, 'rc',?),\
               (?, 'license',?), (?, 'insurance',?),(?, 'pollution',?), (?,'pan',?), (?, 'aadhar',?)";
    console.log(req.body.vehicleNumber+"===vech===="+req.body.seats);
    connection.beginTransaction(function (err) {
        if (err) { 
            console.log("transaction error");
            throw err; 
        }
        connection.query(query,[req.body.vehicleNumber,req.body.seats,vehtype], function (err, rows, fields) {
            console.log("query 1================")
            if (err) {
                console.log("query 1================err")
                return connection.rollback(function () {
                    console.log("query problem")
                    res.json({
                      
                        status: "false",
                        message: "Duplicate entry",
                    });
                   throw err
                });
            }
            connection.query(query1, [req.body.agentId, driverId, req.body.fullName,
                req.body.mobileNumber, regdate, req.body.vehicleNumber], function (err, rows1, fields) {
                    console.log("query 2================")
                if (err) {
                    return connection.rollback(function () {
                        console.log("query 2================err")
                        res.json({
                            
                            status: "false",
                            message: "duplycate entry",
                        });
                        throw err;
                    });
                }
                connection.query(query2, [driverId, req.body.rcNumber,
                    driverId, req.body.licenseNumber,
                    driverId, req.body.insuranceNumber,
                    driverId, req.body.pollutionNumber,
                    driverId, req.body.panNumber,
                    driverId, req.body.aadharNumber], function (err, rows2, fields) {
                        console.log("query 3================")
                    if (err) {
                        return connection.rollback(function () {
                            console.log("data roleebacked")
                            throw err;
                        });
                    }
                connection.commit(function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            res.json({
                            driverId: driverId,
                            status: "false",
                            message: "data not inserted commit trasaction",
                        });
                            throw err;
                        });
                    }
                    res.json({
                        driverId: driverId,
                        status: "true",
                        message: "data inserted",
                    });
                  });
               });
            });
        });
    });
});
process.on("uncaughtException",function(err){
console.log("Exception cought")
console.log(err);
});
module.exports = router;