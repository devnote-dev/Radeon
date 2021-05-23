/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @copyright Radeon Development 2021
 */


const mongoose = require('mongoose');
const { MongoPath } = require('../config.json');
const { logDB } = require('./console/consoleR');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family:4
        };

        mongoose.connect(MongoPath, dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => logDB('connected'));
        mongoose.connection.on('err', err => logDB('error', err));
        mongoose.connection.on('disconnected', () => logDB('disconnected'));
    }
}
