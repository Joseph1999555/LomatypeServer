const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
    language_name: {type: String, required: true},

});

const Language = mongoose.model('Language', LanguageSchema);

module.exports = Language;