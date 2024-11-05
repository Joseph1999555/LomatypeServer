const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    module_name: {type: String, required: true},
    module_description: {type: String, required: true},
});

const Module = mongoose.model('Module', ModuleSchema);

module.exports = Module;