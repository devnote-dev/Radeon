const log = require('../log');
const { MongoPath } = require('../config.json');
const mongoose = require('mongoose');

module.exports = () => {
    const options = {
        useUnifiedTopology: true,
        connectTimeoutMS: 10000,
        useNewUrlParser: true,
        autoIndex: false,
        poolSize: 5,
        family: 4
    }

    mongoose.connect(MongoPath, options);
    mongoose.set('useFindAndModify', false);
    mongoose.Promise = Promise;

    mongoose.connection.on('connect', () => log.info('Connected to database'));
    mongoose.connection.on('err', err => log.error(err, __filename));
    mongoose.connection.on('disconnect', () => log.warn('Disconnected from database'));
}
