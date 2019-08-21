const oracledb = require('oracledb');
const dbConfig = require('../config/config.js');

async function initialize() {
    const pool = await oracledb.createPool(dbConfig.hrPool);
}

module.exports.initialize = initialize;
module.exports = {
    hrPool: {
        user: process.env.HR_USER,
        password: process.env.HR_PASSWORD,
        connectString: process.env.HR_CONNECTIONSTRING,
        poolMin: 10,
        poolMax: 10,
        poolIncrement: 0
    }
};