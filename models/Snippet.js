const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
    snippet_text: {type: String, required: true},
    language_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Language'},
    module_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Module'},
    type_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Type'},
    difficulty_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Difficult'},
    result: {type: String, required: true}
});

const Snippet = mongoose.model('Snippet', SnippetSchema);

module.exports = Snippet;