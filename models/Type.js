const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
    type_name: {type: String, required: true},
    type_description: {type: String, required: true},
    module_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Module'}
});

const Type = mongoose.model('Type', TypeSchema);

module.exports = Type;