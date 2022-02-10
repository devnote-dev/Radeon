/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021-2022
 */

const mongoose = require('mongoose');
const { mongo_path } = require('../config.json');

module.exports = async ({ logger }) => {
    mongoose.connect(mongo_path, {
        useUnifiedTopology: true,
        connectTimeoutMS: 10000,
        useNewUrlParser: true,
        autoIndex: false,
        poolSize: 5,
        family: 4
    });

    mongoose.set('useFindAndModify', false);
    mongoose.connection.on('connected', () => logger.info('connected to database'));
    mongoose.connection.on('err', err => log.db('error', logger.error(err)));
    mongoose.connection.on('disconnected', () => logger.warn('disconnected from database'));

    Promise.resolve();
}
