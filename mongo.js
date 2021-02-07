const mongoose = require('mongoose');
const {MongoPath} = require('./config.json');

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

        mongoose.connection.on('connected', () => {
            console.log('Mongoose | \x1b[32mSuccessfully Connected\x1b[0m');
        });

        mongoose.connection.on('err', err => {
            console.error(`Mongoose | \x1b[33mConnection Error:\x1b[0m\n${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose | \x1b[31mConnection Lost\x1b[0m');
        });
    }
}
