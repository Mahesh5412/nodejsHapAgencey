//var randomstring = require("randomstring");
 
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
var rString = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyz');
var driverId='d'+rString;
console.log(driverId);