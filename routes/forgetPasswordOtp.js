var express = require('express')
var router = express.Router();
var db = require('../connect');
var http = require("https");

var randomOtp = Math.floor(Math.random() * 10000);
router.post('/', function (req, result, next) {

    var mobileNumber = req.body.mobileNumber
    var query = `SELECT * FROM agentRegistration WHERE mobileNumber='${mobileNumber}'`;
    db.query(query, function (err, rows, fields) {
        if (err) {
            // throw err;
            console.log(err);
        }
        else if (rows == 0) {
            result.json({
                status: 'failed',
                message: 'your moble number is not registered'
            });
        }
        else {
            var type;
            var options = {
                "method": "GET",
                "hostname": "api.msg91.com",
                "port": null,
                "path": `/api/v5/otp?authkey=222380AbIJ24Hxtf5b30b1d3&template_id=5e3ba5fbd6fc0531925f987a&mobile=${mobileNumber}&invisible=1&otp=${randomOtp}`,
                "headers": {
                    "content-type": "application/json"
                }
            };
            
            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    const json = body.toString();
                    const obj = JSON.parse(json);
                    type = obj.type;
                    if (type == "success") {
                        console.log(type)
                        var query = `UPDATE agentRegistration SET otp='${randomOtp}' WHERE mobileNumber='${mobileNumber}'`;
                        db.query(query, function (err, result1, fields) {
                            if (!err) {
                                result.json({
                                    message: "success",
                                    status: "true"
                                });
                                return "hi";
                            }
                            else {
                                result.json({
                                    message: "invalid otp",
                                    status: "false"
                                });

                            }
                        });
                    } else {
                        console.log("Error" + type);
                        res.json({
                            status: "false",

                        })
                    }

                    console.log(body.toString());
                    console.log(randomOtp);
                });
            });

            req.end();


        }
    })
});
module.exports = router;