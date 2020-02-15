var express = require('express');
var router = express.Router();
var db = require('../connect');
// var agentId = "a1";

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
//let hours = date_ob.getHours();

// current minutes
//let minutes = date_ob.getMinutes();

// current seconds
//let seconds = date_ob.getSeconds();

// prints date & time in YYYY-MM-DD HH:MM:SS format
//console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

var currentdate = (year + "-" + month + "-" + date);


router.post('/', function (req, res, next) {
    var agentId = req.body.agentId;

    var todayRides = "SELECT dr.driverId, fullName, COUNT(rideDetailId) tRides FROM rideDetail rd INNER JOIN driverRegistration dr ON dr.driverId= rd.driverId WHERE rideStatus='end' AND dr.agentId=? and date(rideStartTime)=?"

    var monthRides = "SELECT dr.driverId, fullName, COUNT(rideDetailId) mRides FROM rideDetail rd INNER JOIN driverRegistration dr ON dr.driverId= rd.driverId WHERE rideStatus='end' \
    AND date(rideStartTime) BETWEEN DATE_SUB(?, INTERVAL 1 MONTH) AND ? AND dr.agentId=?";

    var weekRides = "SELECT dr.driverId, fullName, COUNT(rideDetailId) wRides FROM rideDetail rd INNER JOIN driverRegistration dr ON dr.driverId= rd.driverId WHERE rideStatus='end' AND date(rideStartTime) \
    BETWEEN DATE_SUB(?, INTERVAL 7 DAY) AND ? AND dr.agentId=?";
    //==============================
    var todayEarnings = "SELECT ifnull(dr.driverId, 'NA') driverId, IFNULL(dr.fullName, 'NA') fullName, IFNULL(SUM(totalPayment), 0) tEarn FROM rideDetail \
                    rd INNER JOIN driverRegistration dr ON dr.driverId= rd.driverId INNER JOIN payment p ON p.rideDetailId= rd.rideDetailId WHERE rideStatus='end' AND dr.agentId=? and date(rideStartTime)=?";

    var monthEarnings = "SELECT ifnull(dr.driverId, 'NA') driverId, IFNULL(dr.fullName, 'NA') fullName, IFNULL(SUM(totalPayment), 0) mEarn FROM rideDetail rd INNER JOIN \
    driverRegistration dr ON dr.driverId= rd.driverId INNER JOIN payment p ON p.rideDetailId= rd.rideDetailId WHERE rideStatus='end' \
    AND date(rideStartTime) BETWEEN DATE_SUB(?, INTERVAL 1 MONTH) AND ? AND dr.agentId=?";

    var weekEarnings = " SELECT ifnull(dr.driverId, 'NA') driverId, IFNULL(dr.fullName, 'NA') fullName, IFNULL(SUM(totalPayment), 0) wEarn FROM rideDetail rd INNER JOIN \
    driverRegistration dr ON dr.driverId= rd.driverId INNER JOIN payment p ON p.rideDetailId= rd.rideDetailId WHERE rideStatus='end' AND date(rideStartTime) BETWEEN DATE_SUB(?,\
     INTERVAL 7 DAY) AND ? AND dr.agentId=?";

    db.beginTransaction(function (err) {
        if (err) {
            console.log(err);
            res.json({
                status: "false",
                message: "Server Problem"
            });

        }
        else {
            db.query(todayRides, [agentId,currentdate], function (err, rows1, fields) {
                if (err) {
                    console.log(err);
                    res.json({
                        rides: {},
                        status: "false",
                        message: "No total rides"

                    });
                }
                else {


                    db.query(monthRides, [currentdate, currentdate, agentId], function (err, rows2, fields) {
                        if (err) {
                            console.log(err);
                            res.json({
                                rides: {},
                                status: "false",
                                message: "No Month rides"

                            });
                        }
                        else {
                            db.query(weekRides, [currentdate, currentdate, agentId], function (err, rows3, fields) {
                                if (err) {
                                    console.log(err);
                                    res.json({
                                        rides: {},
                                        status: "false",
                                        message: "No week rides"

                                    });
                                }
                                else {
                                    db.query(todayEarnings, [agentId,currentdate], function (err, rows4, fields) {
                                        if (err) {
                                            console.log(err);
                                            res.json({
                                                earnings: {},
                                                status: "false",
                                                message: "No total earnings"

                                            });
                                        }
                                        else {
                                            db.query(monthEarnings, [currentdate, currentdate, agentId], function (err, rows5, fields) {
                                                if (err) {
                                                    console.log(err);
                                                    res.json({
                                                        earnings: {},
                                                        status: "false",
                                                        message: "No monthly earnings"

                                                    });
                                                }
                                                else {
                                                    db.query(weekEarnings, [currentdate, currentdate, agentId], function (err, rows6, fields) {
                                                        if (err) {
                                                            console.log(err);
                                                            res.json({
                                                                earnings: {},
                                                                status: "false",
                                                                message: "No weekly Earnings"

                                                            });
                                                        }
                                                        else{
                                                        db.commit(function (err) {
                                                            if (err) {
                                                                return connection.rollback(function () {
                                                                    console.log(err);
                                                                    res.json({

                                                                        status: "false",
                                                                        message: "No data found"
                                                                    });

                                                                });
                                                            }
                                                            res.json({
                                                                rideEarnings: {
                                                                    tRides: rows1[0].tRides,
                                                                    mRides: rows2[0].mRides,
                                                                    wRides: rows3[0].wRides,
                                                                    tEarn: rows4[0].tEarn,
                                                                    mEarn: rows5[0].mEarn,
                                                                    wEarn: rows6[0].wEarn,
                                                                },
                                                                status: "true",
                                                                message: "Data got Successfully"

                                                            });
                                                        });
                                                    }


                                                    });
                                                }
                                            });
                                        }
                                    });
                                }


                            });
                        }
                    });
                }
            });
        }
    });
});
process.on("uncaughtException", function (err) {
    console.log("Exception cought")
    console.log(err);
});
module.exports = router;