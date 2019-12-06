require('../config/config.js');
const oracledb = require('oracledb');
oracledb.autoCommit = true;
const crypto = require('crypto');

var express = require('express'),
    app = express(),
    router = express.Router();


//MÉTODOS EMPLEADOS CRUD 

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
    if (!req.body.ID_EMPLEADO || !req.body.SNOMBRE_EMPLEADO || !req.body.PAPELLIDO_EMPLEADO || !req.body.SAPELLIDO_EMPLEADO || !req.body.EDAD_EMPLEADO || !req.body.RUN_EMPLEADO || !req.body.DV_EMPLEADO || !req.body.DIRECCION || !req.body.ID_COMUNA || !req.body.ID_AREA || !req.body.ID_CARGO) {
        res.status(400).json({ ok: false, message: "Faltan campos" })
        return
    }
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


    let ID_EMPLEADO_UPDATE = req.body.ID_EMPLEADO; //validado
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
                .execute('UPDATE EMPLEADOS SET SNOMBRE_EMPLEADO =:SNOMBRE_EMPLEADONEW,PAPELLIDO_EMPLEADO =:PAPELLIDO_EMPLEADONEW,SAPELLIDO_EMPLEADO =:SAPELLIDO_EMPLEADONEW, EDAD_EMPLEADO =:EDAD_EMPLEADONEW,RUN_EMPLEADO =:RUN_EMPLEADONEW,DV_EMPLEADO =:DV_EMPLEADONEW,DIRECCION =:DIRECCIONNEW,ID_COMUNA =:ID_COMUNANEW,ID_AREA =:ID_AREANEW,ID_CARGO =:ID_CARGONEW WHERE ID_EMPLEADO in :ID_EMPLEADO_UPDATE ', {
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
                    ID_EMPLEADO_UPDATE: ID_EMPLEADO_UPDATE,
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

router.get('/empleadoBuscar', (req, res) => {

    if (!req.query.id_empleado) {
        res.status(400).json({
            ok: false,
            message: 'No se envió una id de empleado'


        });
    }
    async function empleadoBuscar() {
        let connection;
        let id = req.query.id_empleado;

        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });

            const result = await connection
                .execute('SELECT * FROM EMPLEADOS WHERE ID_EMPLEADO IN :1', [id]);
            var response = result.rows;
            res.status(200).json({
                response


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


    empleadoBuscar();


});

router.put('/empleadoDelete', (req, res) => {

    if (!req.body.id_empleado) {
        res.status(400).json({ status: false, message: 'Bad Request' })
        return
    }
    async function empleadoDelete() {
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        let id_empleado_IN = req.body.id_empleado;
        let connection;

        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });
            let disableConstraint1 = await connection.execute('ALTER TABLE EMPLEADOS DISABLE CONSTRAINT EMPLEADOS_FK1').then(console.log('ok'));
            /*let disableConstraint2 = await connection.execute('ALTER TABLE EMPLEADOS DISABLE CONSTRAINT EMPLEADOS_FK2').then(console.log('ok'));
            let disableConstraint3 = await connection.execute('ALTER TABLE EMPLEADOS DISABLE CONSTRAINT EMPLEADOS_FK3').then(console.log('ok'));
            let disableConstraint4 = await connection.execute('ALTER TABLE EMPLEADOS DISABLE CONSTRAINT EMPLEADOS_FK4').then(console.log('ok'));*/
            let result1 = await connection.execute('DELETE FROM USUARIOS WHERE ID_USUARIO IN (SELECT ID_USUARIO FROM EMPLEADOS WHERE ID_EMPLEADO IN :1)', [id_empleado_IN]).then(console.log('ok'));;

            res.status(200).json({ ok: true, message: 'El empleado ' + id_empleado_IN + ' ha sido eliminado' });
        } catch (error) {
            console.log(error)
        } finally {
            let result2 = await connection.execute('DELETE FROM EMPLEADOS WHERE ID_EMPLEADO IN :1', [id_empleado_IN]).then(console.log('ok'));
            let enableConstraint1 = await connection.execute('ALTER TABLE EMPLEADOS ENABLE NOVALIDATE CONSTRAINT EMPLEADOS_FK1;').then(console.log('ok'));
            let enableConstraint2 = await connection.execute('ALTER TABLE EMPLEADOS ENABLE NOVALIDATE CONSTRAINT EMPLEADOS_FK2;').then(console.log('ok'));
            let enableConstraint3 = await connection.execute('ALTER TABLE EMPLEADOS ENABLE NOVALIDATE CONSTRAINT EMPLEADOS_FK3;').then(console.log('ok'));
            let enableConstraint4 = await connection.execute('ALTER TABLE EMPLEADOS ENABLE NOVALIDATE CONSTRAINT EMPLEADOS_FK4;').then(console.log('ok'));
            const commit = await connection.execute('commit').then(console.log('ok'));;
            connection.close()
        }

    }
    empleadoDelete()

});
//Métodos para cargar ComboBoxes en UI EMPLEADOS
router.get('/comboComuna', (req, res) => {

    if (!req) {
        res.status(400).json({
            ok: false,
            message: 'Error en el request'
        });
        return
    }
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    async function comboComuna() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });
            const result = await connection.execute('SELECT ID_COMUNA,NOMBRE_COMUNA FROM COMUNA ORDER BY ID_COMUNA');
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

    comboComuna();

});

router.get('/comboUsuario', (req, res) => {

    if (!req) {
        res.status(400).json({
            ok: false,
            message: 'Error en el request'
        });
        return
    }
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    async function comboUsuario() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });
            const result = await connection.execute('SELECT ID_USUARIO, CORREO_USUARIO FROM USUARIOS WHERE ID_USUARIO IN (SELECT MAX(ID_USUARIO) FROM USUARIOS)');
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

    comboUsuario();

});

router.get('/comboCargo', (req, res) => {

    if (!req) {
        res.status(400).json({
            ok: false,
            message: 'Error en el request'
        });
        return
    }
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    async function comboCargo() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });
            const result = await connection.execute('SELECT ID_CARGO,NOMBRE_CARGO FROM CARGO ORDER BY ID_CARGO');
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

    comboCargo();

});

router.get('/comboArea', (req, res) => {

    if (!req) {
        res.status(400).json({
            ok: false,
            message: 'Error en el request'
        });
        return
    }
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    async function comboArea() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user: process.env.USER,
                password: process.env.PASSWORD,
                connectString: process.env.ORACLE_URI
            });
            const result = await connection.execute('SELECT ID_AREA,NOMBRE_AREA FROM AREA ORDER BY ID_AREA');
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

    comboArea();

});
module.exports = router