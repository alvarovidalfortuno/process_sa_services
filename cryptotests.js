const crypto = require('crypto');


console.log('Iniciando programa')


var password = '123'
var PasswordHash = 'P@@Sw0rd';

var VIKey = '@1B2c3D4e5F6g7H8';


var bytesArr = getBytes(password);





console.log(bytesArr)

var hashresult = passwordHash(password);
console.log(hashresult)





function passwordHash(password) {

    const salt = 'S@LT&KEY';

    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'MD5').toString('hex');
    return [salt, hash].join('$');
}



function getBytes(text) {

    var bytes = []
    for (var i = 0; i < password.length; ++i) {
        bytes.push(password.charCodeAt(i));
    }

    return bytes
}