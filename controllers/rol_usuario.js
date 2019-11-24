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
    async function rolList() {
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

    rolList();

})

router.post('/rolUsuarioCreate', (req, res) => {


    if (!req.body.id_rol || !req.body.id_empleado) {
        res.status(400).json({ ok: false, message: "Faltan campos" })
        return
    }
    //lógica para Query
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let id_rol_IN = req.body.id_rol;
    let id_empleado_IN = req.body.id_empleado;
    async function rolUsuarioCreate() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection.execute('INSERT INTO ROL_USUARIO VALUES((SELECT MAX(ID_ROL_USER)+1 FROM ROL_USUARIOS),:1,:2)', [id_rol_IN, id_empleado_IN]);
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
                    const commit = await connection.execute('commit')
                    await connection.close();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    rolUsuarioCreate();
});

router.put('/rolUsuarioUpdate', (req, res) => {

    if (!req.body.id_rol_user || !req.body.id_rol || !req.body.id_empleado) {
        res.status(400).json({ ok: false, message: "Faltan campos" })
        return
    }
    //lógica para Query
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let id_rol_user_IN = req.body.id_rol_user
    let id_rol_IN = req.body.id_rol;
    let id_empleado_IN = req.body.id_empleado;

    async function rolUsuarioUpdate() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection.execute('UPDATE ROL_USUARIO SET ID_ROL = :1 , ID_EMPLEADO = :2 WHERE CORREO_USUARIO in :3', { 1: id_rol_IN, 2: id_empleado_IN, 3: id_rol_user_IN });
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
                    const commit = await connection.execute('commit');
                    await connection.close();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    rolUsuarioUpdate();


});

router.delete('/rolUsuarioDelete', (req, res) => {

    if (!req.body.id_rol_user) {
        res.status(400).json({ status: false, message: 'Bad Request' })
        return
    }
    async function rolUsuarioDelete() {
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        let id_rol_user_IN = req.body.id_rol_user;
        let connection;

        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            let result = await connection.execute('DELETE FROM ROL_USUARIO WHERE ID_ROL_USER IN :1', [id_rol_user_IN])
            res.status(200).json({ ok: true, message: 'El Usuario ' + id_rol_user_IN + ' ha sido eliminado' })
        } catch (error) {
            console.log(error)
        } finally {
            const commit = await connection.execute('commit');

            connection.close()
        }

    }
    rolUsuarioDelete()

});


module.exports = router