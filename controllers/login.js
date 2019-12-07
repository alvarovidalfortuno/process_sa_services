require('../config/config.js');
const oracledb = require('oracledb');
oracledb.autoCommit = true;
const crypto = require('crypto');

var express = require('express'),
    app = express(),
    router = express.Router();

router.post('/login', (req, res) => {
    //Métodod recibe el usuario solicitado, con este valor se buscara el password en la BD y se enviará a la 
    //app de escritorio
    if (!req.body.usuario) {
        res.status(400).json({ ok: false, message: "Usuarios vacío" })
        return
    }
    //lógica para Query
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let usuariosIN = req.body.usuario;
    async function getLoginCredentials() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection.execute('SELECT CONTRASE�A_USUARIO FROM USUARIOS WHERE CORREO_USUARIO = :1', [usuariosIN]);
            let user_password_in = Object.values(result.rows)
            let json = JSON.stringify(user_password_in)
            res.status(200).json({
                json
            });
            //return result.rows
        } catch (error) {} finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {}
            }
        }
    }
    getLoginCredentials();
});

module.exports = router