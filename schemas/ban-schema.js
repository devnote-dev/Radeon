const mongoose = require('mongoose');

const banSchema = mongoose.Schema({
    guilds:  [String],
    users:   [String]
});

module.exports = mongoose.model('banlist', banSchema, 'Banned');
