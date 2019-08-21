require('./config/config.js');


const express = require('express');
const app = express();
// *** line that requires services/web-server.js is here ***
const dbConfig = require('./config/database.js');
const defaultThreadPoolSize = 4;

// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        "Name": global.config.Name,
        "Author": "Alvaro Vidal Fortuño",
        "Version": global.config.Version,
        "Instance": global.config.Instance,
        "Port": process.env.PORT,
        "Status": "Running"
    });
});
//Allowing access from any domain once in production

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use('/', require('./controllers/default'));



app.listen(process.env.PORT, () => {

    console.log('%s v%s -\x1b[32m Running at Port %s \x1b[0m- %s', global.config.Name, global.config.Version, global.config.Port, Date().toLocaleString());

});