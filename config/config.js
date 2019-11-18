try {
    global.config = require('./config.json').ProcessServices;
    /**
     * ===========================================
     * Puerto
     * ===========================================
     */

    process.env.PORT = process.env.PORT || 8000;

    /**
     * ===========================================
     * DB Connection parameters
     * ===========================================
     */

    process.env.USER = process.env.USER || 'BDPORTAFOLIO'
    process.env.PASSWORD = process.env.PASSWORD || '123'
    process.env.ORACLE_URI = process.env.ORACLE_URI || '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=xe)))'

} catch (error) {
    console.log('Process SA Services v1.0.0-\x1b[31m CONFIGURATION  ERROR \x1b[0m- %s', Date().toLocaleString());
    console.log(error);
}