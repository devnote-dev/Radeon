const mongoose = require('mongoose');

module.exports = {
    init: async () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        };

        mongoose.connection.on('connected', () => {
            console.log('Mongoose | \x1b[32mSuccessfully Connected\x1b[0m');
        });

        mongoose.connection.on('err', err => {
            console.error(`Mongoose | \x1b[33mConnection Error:\x1b[0m\n${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose | \x1b[31mConnection Lost\x1b[0m');
        });

        await mongoose.connect('mongodb+srv://Admins:Admins@radeon.xecdu.mongodb.net/Radeon?retryWrites=true&w=majority', dbOptions);
    }
}
