require('../config/config.js');
const oracledb = require('oracledb');
oracledb.autoCommit = true;
const crypto = require('crypto');

var express = require('express'),
    app = express(),
    router = express.Router();


//MËTODOS ROL
router.get('/rolList', (req, res) => {
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
            const result = await connection.execute('SELECT * FROM ROLES ORDER BY ID_ROL');
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

router.post('/rolCreate', (req, res) => {


    if (!req.body.correo_usuario || !req.body.password) {
        res.status(400).json({ ok: false, message: "Faltan campos" })
        return
    }
    //lógica para Query
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let nombre_rol_IN = req.body.nombre_rol;
    let desc_rol_IN = req.body.desc_rol;
    async function rolCreate() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection.execute('INSERT INTO ROLES VALUES((SELECT MAX(ID_ROL)+1 FROM ROLES),:1,:2)', [nombre_rol_IN, desc_rol_IN]);
            res.status(200).json({
                ok: true,
                message: 'ROL creado exitosamente!'
            });
            return result
        } catch (error) {
            console.log(error);
        } finally {
            const commit = await connection.execute('commit')
            if (connection) {
                try {

                    await connection.close();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    rolCreate();
});

router.put('/rolUpdate', (req, res) => {

    if (!req.body.id_rol || !req.body.nombre_rol || !req.body.desc_rol) {
        res.status(400).json({ ok: false, message: "Faltan campos" })
        return
    }
    //lógica para Query
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let id_rol_IN = req.body.id_rol
    let nombre_rol_IN = req.body.nombre_rol;
    let desc_rol_IN = req.body.desc_rol;

    async function rolUpdate() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection.execute('UPDATE ROLES SET NOMBRE_ROL = :1 , DESC_ROL = :2 WHERE ID_ROL in :3', { 1: id_rol_IN, 2: nombre_rol_IN, 3: desc_rol_IN });
            res.status(200).json({
                ok: true,
                message: 'ROL actualizado exitosamente!'
            });
            return result.rows
        } catch (error) {
            console.log(error);
        } finally {
            const commit = await connection.execute('commit')
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    rolUpdate();


});

router.delete('/rolDelete', (req, res) => {

    if (!req) {
        res.status(400).json({ status: false, message: 'Bad Request' })
        return
    }
    async function rolDelete() {
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        let id_rol_IN = req.body.id_rol;
        let connection;

        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            let result = await connection.execute('DELETE FROM ROLES WHERE ID_ROL IN :1', [id_rol_IN])
            res.status(200).json({ ok: true, message: 'El ROL ' + id_rol_IN + ' ha sido eliminado' })
        } catch (error) {
            console.log(error)
        } finally {
            const commit = await connection.execute('commit')
            connection.close()
        }

    }
    rolDelete()

});

module.exports = router