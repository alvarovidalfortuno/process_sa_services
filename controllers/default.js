require('../config/config.js');

var express = require('express'),
    app = express(),
    router = express.Router();


router.get('/test', (req, res) => {

    res.status(200).json({
        ok: true,
        message: "Este GET se ve bueno chicos"
    });

});

router.post('/test', (req, res) => {

    res.status(200).json({
        ok: true,
        message: "Este POST se ve bueno chicos"
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