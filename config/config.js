try {
    global.config = require('./config.json').ProcessServices;
    /**
     * ===========================================
     * Puerto
     * ===========================================
     */

    process.env.PORT = process.env.PORT || 3000;
} catch (error) {
    console.log('Process SA Services v1.0.0-\x1b[31m CONFIGURATION  ERROR \x1b[0m- %s', Date().toLocaleString());
    console.log(error);
}