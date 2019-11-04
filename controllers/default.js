require('../config/config.js');
const oracledb = require('oracledb');
oracledb.autoCommit = true;
const crypto = require('crypto');

var express = require('express'),
    app = express(),
    router = express.Router();


//MÉTODOS



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

            const result = await connection.execute('SELECT CONTRASEÑA_USUARIO FROM USUARIOS WHERE CORREO_USUARIO = :1', [usuariosIN]);
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
    getLoginCredentials();
});
//Método para crear usuarios
router.post('/usuarioCreate', (req, res) => {

    /*
        if (!req.body.correo_usuario || !req.body.password || !req.body.role) {
            res.status(400).json({ ok: false, message: "Faltan campos" })
            return
        }*/
    //lógica para Query
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let usuariosIN = req.body.usuario;
    async function usuarioCreate() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection.execute('INSERT INTO USUARIOS VALUES(:1,:2,:3)', [12, 'usuario12@gmail.com', 'testpassword']);
            console.log(result);
            res.status(200).json({
                ok: true,
                message: 'Usuario creado exitosamente!'
            });
            return result.rows
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
    usuarioCreate();
});

router.put('/usuarioUpdate', (req, res) => {

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

            const result = await connection.execute('SELECT CONTRASEÑA_USUARIO FROM USUARIOS WHERE CORREO_USUARIO= ', usuariosIN);
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
    getLoginCredentials();


});

router.delete('/test', (req, res) => {

    res.status(200).json({
        ok: true,
        message: "Este DELETE se ve bueno chicos"
    });

});


module.exports = router