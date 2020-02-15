var express =require('express');
var router =express.Router();
var db = require('../connect');

router.post('/', function(req,res,next){
    var aid=req.body.aid;
    console.log(aid);

    var query="select name,mobileNumber,email from agentRegistration where aid='"+aid+"'" ;
    db.query(query,function(err,rows,fields){
        if(err) {
            res.json({
                ProfileDetails:{},
                status: "false",
                message: "server Problem",
            });
        }
        else if(rows.length > 0){
            res.json({
                ProfileDetails:rows[0],
                status:'true',
                message:'Agent Details'
            });
        }
        else{
            res.json({
                ProfileDetails:{},
                status: "false",
                message: "no agents are with this id",
            });
        }
        
    })
})
process.on("uncaughtException",function(err){
    console.log("Exception cought")
    console.log(err);
    });
module.exports = router;