require('../config/config.js');
const oracledb = require('oracledb');
const crypto = require('crypto');

var express = require('express'),
    app = express(),
    router = express.Router();


//MÉTODOS

router.get('/tarea', (req, res) => {

    //Transforming output format for QUERY RESULT
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

    const password = req.body.password;
    async function getTarea() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection.execute('SELECT ID_TAREA, NOMBRE_TAREA, DESC_TAREA, FECHA_INICIO, DEADLINE, FECHA_TERMINO, DIAS_TOTAL, ID_USUARIO FROM TAREAS');
            //console.log(result.rows);
            res.status(200).json({
                ok: true,
                message: result.rows
            });
            //return result.rows
        } catch (error) {
            console.log(error);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }


    getTarea();

});

router.post('/test', (req, res) => {

    res.status(200).json({
        ok: true,
        message: "Este POST se ve bueno chicos"
    });

});


router.post('/login', (req, res) => {

    if (!req.body.usuario || !req.body.password) {
        res.status(400).json({ ok: false, message: "Las credenciales no han sido enviadas" })
        return
    }

    //extraer byte[] cipherTextBytes
    let data = 'BmwzQACRCmddGbSXdUJIGw==';
    let buff = Buffer.from(data, 'base64');
    let arrByte = Uint8Array.from(buff);
    //************************ */
    //console.log('arrByte: ', arrByte.toString());




    const storedHashString = 'P@@Sw0rd';
    const storedSaltString = 'S@LT&KEY';
    const vikey = '@1B2c3D4e5F6g7H8';

    const storedHashBytes = new Buffer.from(storedHashString, 'base64');
    const storedSaltBytes = new Buffer.from(storedSaltString, 'base64');

    let arrByteHash = Uint8Array.from(storedHashBytes);
    let arrByteSalt = Uint8Array.from(storedSaltBytes);


    crypto.pbkdf2(arrByteHash, arrByteSalt, 1000, 20, 'sha512',
        (err, calculatedHashBytes) => {


            console.log(calculatedHashBytes.toString())



        }
    );

    res.status(200).json({
        ok: true,
        message: "Login exitoso!"
    });

});

router.put('/test', (req, res) => {

    res.status(200).json({
        ok: true,
        message: "Este PUT se ve bueno chicos"
    });

});

router.delete('/test', (req, res) => {

    res.status(200).json({
        ok: true,
        message: "Este DELETE se ve bueno chicos"
    });

});


module.exports = router