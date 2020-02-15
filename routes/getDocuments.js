var express = require('express');
var router = express.Router();
var db = require('../connect');
router.post('/', function (req, res, next) {
    var id = req.body.driverId;

    var query = `SELECT id,documentName,documentPath  FROM documentDetail WHERE id='${id}'`;
    db.query(query, function (err, rows, fields) {
        if (err) {
            res.json({
                documentResponse:rows,
                  status: "false",
                  message: "Server Problem",
              });
            console.log(err);
        }
        else if(rows.length > 0)  {
            res.json({
              documentResponse:rows,
                status: "true",

                message: "success",
            });
          //  console.log(rows);
        }
        else{
            res.json({
                documentResponse:{},
                status: "false",
                message: "no documents are avilable",
            });
        }
    
       
    })
});
module.exports = router;