require('./config/config.js');


const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        "Name": global.config.Name,
        "Version": global.config.Version,
        "Instance": global.config.Instance,
        "Port": global.config.Port,
        "Status": "Running"
    });
});
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use('/', require('./controllers/default'));



app.listen(global.config.Port, () => {

    console.log('%s v%s -\x1b[32m Running at Port %s \x1b[0m- %s', global.config.Name, global.config.Version, global.config.Port, Date().toLocaleString());

});