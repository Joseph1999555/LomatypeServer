const mongoose = require('mongoose');

const TypingstatSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    code_snippet_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Snippet'},
    typing_speed: {type: String, required: false},
    typing_accuracy: {type: String, required: false},
    typing_errors: {type: String, required: false},
    typing_time: {type: String, required: false},
    module_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Module'},
    type_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Type'},
    difficult_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Difficult'},
    language_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Language'},
    created_at: {type: Date, default: Date.now}
});

const Typingstat = mongoose.model('Typingstat', TypingstatSchema);

module.exports = Typingstat;