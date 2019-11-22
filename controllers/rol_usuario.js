require('../config/config.js');
const oracledb = require('oracledb');
oracledb.autoCommit = true;
const crypto = require('crypto');

var express = require('express'),
    app = express(),
    router = express.Router();


//MÉTODOS USUARIOS

router.get('/rolUsuarioList', (req, res) => {
    if (!req) {
        res.status(400).json({
            ok: false,
            message: 'Error en el request'
        });
        return
    }
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    async function usuarioList() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });
            const result = await connection.execute('SELECT * FROM ROL_USUARIO ORDER BY ID_ROL_USER');
            res.status(200).json({
                message: result.resultSet,
                Rows: result.rows
            })

        } catch (err) {
            console.log(err)
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

    usuarioList();

})

router.post('/usuarioCreate', (req, res) => {


    if (!req.body.correo_usuario || !req.body.password) {
        res.status(400).json({ ok: false, message: "Faltan campos" })
        return
    }
    //lógica para Query
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let correo_usuario_IN = req.body.correo_usuario;
    let password_IN = req.body.password;
    let role_IN = req.body.role;
    async function usuarioCreate() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection.execute('INSERT INTO USUARIOS VALUES((SELECT MAX(ID_USUARIO)+1 FROM USUARIOS),:1,:2)', [correo_usuario_IN, password_IN]);
            res.status(200).json({
                ok: true,
                message: 'Usuario creado exitosamente!'
            });
            return result
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

    if (!req.body.correo_usuario || !req.body.password_new || !req.body.correo_usuario_new) {
        res.status(400).json({ ok: false, message: "Faltan campos" })
        return
    }
    //lógica para Query
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let correo_usuario = req.body.correo_usuario
    let correo_usuario_new = req.body.correo_usuario_new;
    let password_new = req.body.password_new;

    async function usuarioUpdate() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection.execute('UPDATE USUARIOS SET CORREO_USUARIO = :correonew , CONTRASE�A_USUARIO = :passwordnew WHERE CORREO_USUARIO in :usuario', { correonew: correo_usuario_new, passwordnew: password_new, usuario: correo_usuario });
            res.status(200).json({
                ok: true,
                message: 'Usuario actualizado exitosamente!'
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
    usuarioUpdate();


});

router.delete('/usuarioDelete', (req, res) => {

    if (!req) {
        res.status(400).json({ status: false, message: 'Bad Request' })
        return
    }
    async function usuarioDelete() {
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        let correo_usuario_IN = req.body.correo_usuario;
        let connection;

        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            let result = await connection.execute('DELETE FROM USUARIOS WHERE CORREO_USUARIO IN :1', [correo_usuario_IN])
            res.status(200).json({ ok: true, message: 'El Usuario ' + correo_usuario_IN + ' ha sido eliminado' })
        } catch (error) {
            console.log(error)
        } finally {
            connection.close()
        }

    }
    usuarioDelete()

});


module.exports = router