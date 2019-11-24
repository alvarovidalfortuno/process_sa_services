require('../config/config.js');
const oracledb = require('oracledb');
oracledb.autoCommit = true;
const crypto = require('crypto');

var express = require('express'),
    app = express(),
    router = express.Router();


//MÉTODOS USUARIOS

router.get('/EmpleadoList', (req, res) => {
    if (!req) {
        res.status(400).json({
            ok: false,
            message: 'Error en el request'
        });
        return
    }
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    async function empleadoList() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });
            const result = await connection.execute('SELECT * FROM EMPLEADOS ORDER BY ID_EMPLEADO');
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

    empleadoList();

})

router.post('/empleadoCreate', (req, res) => {

    //TODO Agregar campos para validar
    if (!req.body.SNOMBRE_EMPLEADO || !req.body.PAPELLIDO_EMPLEADO || !req.body.SAPELLIDO_EMPLEADO || !req.body.EDAD_EMPLEADO || !req.body.RUN_EMPLEADO || !req.body.DV_EMPLEADO || !req.body.DIRECCION || !req.body.ID_COMUNA || !req.body.ID_USUARIO || !req.body.ID_AREA || !req.body.ID_CARGO) {
        res.status(400).json({ ok: false, message: "Faltan campos" })
        return
    }
    //lógica para Query
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    let SNOMBRE_EMPLEADO = req.body.SNOMBRE_EMPLEADO;
    let PAPELLIDO_EMPLEADO = req.body.PAPELLIDO_EMPLEADO;
    let SAPELLIDO_EMPLEADO = req.body.SAPELLIDO_EMPLEADO;
    let EDAD_EMPLEADO = req.body.EDAD_EMPLEADO;
    let RUN_EMPLEADO = req.body.RUN_EMPLEADO;
    let DV_EMPLEADO = req.body.DV_EMPLEADO;
    let DIRECCION = req.body.DIRECCION;
    let ID_COMUNA = req.body.ID_COMUNA;
    let ID_USUARIO = req.body.ID_USUARIO;
    let ID_AREA = req.body.ID_AREA;
    let ID_CARGO = req.body.ID_CARGO;

    async function empleadoCreate() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection
                .execute('INSERT INTO EMPLEADOS VALUES((SELECT MAX(ID_EMPLEADO)+1 FROM EMPLEADOS),:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11)', [SNOMBRE_EMPLEADO, PAPELLIDO_EMPLEADO, SAPELLIDO_EMPLEADO, EDAD_EMPLEADO, RUN_EMPLEADO, DV_EMPLEADO, DIRECCION, ID_COMUNA, ID_USUARIO, ID_AREA, ID_CARGO]);


            res.status(200).json({
                ok: true,
                message: 'Empleado creado exitosamente!'
            });
            console.log('result: ', result)
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
    empleadoCreate();
});

router.put('/empleadoUpdate', (req, res) => {
    //TODO Enviar id_usuario de la sesion iniciada 
    if (!req.body.ID_USUARIO_LOGIN || !req.body.SNOMBRE_EMPLEADO || !req.body.PAPELLIDO_EMPLEADO || !req.body.SAPELLIDO_EMPLEADO || !req.body.EDAD_EMPLEADO || !req.body.RUN_EMPLEADO || !req.body.DV_EMPLEADO || !req.body.DIRECCION || !req.body.ID_COMUNA || !req.body.ID_AREA || !req.body.ID_CARGO) {
        res.status(400).json({ ok: false, message: "Faltan campos" })
        return
    }
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


    let ID_USUARIO_LOGIN = req.body.ID_USUARIO_LOGIN; //validado
    let SNOMBRE_EMPLEADO = req.body.SNOMBRE_EMPLEADO; //validado
    let PAPELLIDO_EMPLEADO = req.body.PAPELLIDO_EMPLEADO; //validado
    let SAPELLIDO_EMPLEADO = req.body.SAPELLIDO_EMPLEADO;
    let EDAD_EMPLEADO = req.body.EDAD_EMPLEADO;
    let RUN_EMPLEADO = req.body.RUN_EMPLEADO;
    let DV_EMPLEADO = req.body.DV_EMPLEADO;
    let DIRECCION = req.body.DIRECCION;
    let ID_COMUNA = req.body.ID_COMUNA;
    let ID_AREA = req.body.ID_AREA;
    let ID_CARGO = req.body.ID_CARGO;

    async function empleadoUpdate() {

        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection
                .execute('UPDATE EMPLEADOS SET SNOMBRE_EMPLEADO =:SNOMBRE_EMPLEADONEW,PAPELLIDO_EMPLEADO =:PAPELLIDO_EMPLEADONEW,SAPELLIDO_EMPLEADO =:SAPELLIDO_EMPLEADONEW, EDAD_EMPLEADO =:EDAD_EMPLEADONEW,RUN_EMPLEADO =:RUN_EMPLEADONEW,DV_EMPLEADO =:DV_EMPLEADONEW,DIRECCION =:DIRECCIONNEW,ID_COMUNA =:ID_COMUNANEW,ID_AREA =:ID_AREANEW,ID_CARGO =:ID_CARGONEW WHERE ID_USUARIO in :ID_USUARIO_LOGIN ', {
                    SNOMBRE_EMPLEADONEW: SNOMBRE_EMPLEADO,
                    PAPELLIDO_EMPLEADONEW: PAPELLIDO_EMPLEADO,
                    SAPELLIDO_EMPLEADONEW: SAPELLIDO_EMPLEADO,
                    EDAD_EMPLEADONEW: EDAD_EMPLEADO,
                    RUN_EMPLEADONEW: RUN_EMPLEADO,
                    DV_EMPLEADONEW: DV_EMPLEADO,
                    DIRECCIONNEW: DIRECCION,
                    ID_COMUNANEW: ID_COMUNA,
                    ID_AREANEW: ID_AREA,
                    ID_CARGONEW: ID_CARGO,
                    ID_USUARIO_LOGIN: ID_USUARIO_LOGIN,
                });

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
    empleadoUpdate();


});

router.delete('/empleadoDelete', (req, res) => {

    if (!req.body.id_empleado) {
        res.status(400).json({ status: false, message: 'Bad Request' })
        return
    }
    async function usuarioDelete() {
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        let id_empleado_IN = req.body.id_empleado;
        let connection;

        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            let result = await connection.execute('DELETE FROM EMPLEADOS WHERE ID_EMPLEADO IN :1', [id_empleado_IN])
            res.status(200).json({ ok: true, message: 'El empleado ' + id_empleado_IN + ' ha sido eliminado' })
        } catch (error) {
            console.log(error)
        } finally {
            const commit = await connection.execute('commit')
            connection.close()
        }

    }
    usuarioDelete()

});


module.exports = router