/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @copyright 2021 Radeon Development
 */

const log = require('../log');
const { mongo_path } = require('../config.json');
const mongoose = require('mongoose');

module.exports = () => {
    const options = {
        useUnifiedTopology: true,
        connectTimeoutMS: 10000,
        useNewUrlParser: true,
        autoIndex: false,
        maxPoolSize: 5,
        family: 4
    }

    mongoose.connect(mongo_path, options);
    mongoose.Promise = Promise;

    mongoose.connection.on('connect', () => log.info('Connected to database'));
    mongoose.connection.on('err', err => log.error(err, __filename));
    mongoose.connection.on('disconnect', () => log.warn('Disconnected from database'));
}
