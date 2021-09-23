/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @copyright Radeon Development 2021
 */

const mongoose = require('mongoose');
const { MongoPath } = require('../config.json');
const log = require('./log');

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

        mongoose.connection.on('connected', log.db('connected'));
        mongoose.connection.on('err', err => log.db('error', err));
        mongoose.connection.on('disconnected', log.db('disconnected'));
    }
}
