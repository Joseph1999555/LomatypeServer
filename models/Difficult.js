const mongoose = require('mongoose');

const DifficultSchema = new mongoose.Schema({
    difficult_level: {type: String, required: true},
});

const Difficult = mongoose.model('Difficult', DifficultSchema);

module.exports = Difficult;