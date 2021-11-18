const mongoose = require('mongoose');
const { MongoPath } = require('../config.json');

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

    // TODO: add log functions
}
