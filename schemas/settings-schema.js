const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    client:{
        type:     String,
        required: true
    },
    maintenance:{
        type:    Boolean,
        default: false
    }
});

module.exports = mongoose.model('settings', settingsSchema, 'Settings');