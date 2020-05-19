const mongoose = require('mongoose');
const logger = require('../services/logger.service');

const config  =  require('../config');

// Database Name
const dbName = 'quizme_db';

var dbConn = null;

module.exports =  async () => {
    if (dbConn) return dbConn;
    try {
        const db = await mongoose.connect(`${config.dbURL}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.set('useFindAndModify', false);
        dbConn = db;
        return db;
    } catch(err) {
        logger.error('[CONNECT]: Cannot Connect to DB ', err);
        throw err;
    }
}