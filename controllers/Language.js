const Language = require('../models/Language');

const CreateLanguage = async (req, res) => {
    const { name } = req.body;
    const language = new Language({ language_name: name });

    try {
        await language.save();
        res.status(201).json(language);
    } catch (error) {
        console.error('Error adding language:', error);
        res.status(500).json({ message: 'Error adding language', error });
    }
};

const FetchLanguages = async (req, res) => {
    try {
        const languages = await Language.find();
        res.status(200).json(languages);
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({ message: 'Error fetching languages', error });
    }
};

const UpdateLanguage = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        await Language.findByIdAndUpdate(id, { language_name: name });
        res.status(200).json({ message: 'Language updated successfully' });
    } catch (error) {
        console.error('Error updating language:', error);
        res.status(500).json({ message: 'Error updating language', error });
    }
};

const DeleteLanguage = async (req, res) => {
    const { id } = req.params;

    try {
        await Language.findByIdAndDelete(id);
        res.status(200).json({ message: 'Language deleted successfully' });
    } catch (error) {
        console.error('Error deleting language:', error);
        res.status(500).json({ message: 'Error deleting language', error });
    }
};          

module.exports = { CreateLanguage, FetchLanguages, UpdateLanguage, DeleteLanguage };