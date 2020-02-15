var mysql = require('mysql');
var datetime = require('node-datetime');
var con = mysql.createConnection({
  host: "192.168.0.140",
  user: "hapagency",
  password: "hapagency",
  database:"hapagency"
});
con.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
  }

  console.log('DB connected successfully as id ' + con.threadId);
  console.log(datetime.create());
});

module.exports = con;

