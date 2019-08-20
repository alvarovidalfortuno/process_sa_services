try {
    global.config = require('./config.json').ProcessServices;
} catch (error) {
    console.log('Process SA Services v1.0.0-\x1b[31m CONFIGURATION  ERROR \x1b[0m- %s', Date().toLocaleString());
    console.log(error);
}