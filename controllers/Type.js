const Type = require('../models/Type');

// Create Type with validation
const CreateType = async (req, res) => {
    const { name, module_id, type_description } = req.body;
    console.log('CreateType', name, module_id, type_description);

    if (!name || !module_id) {
        return res.status(400).json({ message: 'Name and Module ID are required' });
    }

    const type = new Type({ type_name: name, module_id, type_description });    

    try {
        await type.save();
        res.status(201).json(type);
    } catch (error) {
        console.error('Error adding type:', error);
        res.status(500).json({ message: 'Error adding type', error });
    }
};

// Fetch Types, optionally filter by module_id
const FetchTypes = async (req, res) => {
    const { module_id } = req.query; // Accept module_id from query parameter

    try {
        const filter = module_id ? { module_id } : {};
        const types = await Type.find(filter).populate('module_id', 'module_name');
        res.status(200).json(types);
    } catch (error) {
        console.error('Error fetching types:', error);
        res.status(500).json({ message: 'Error fetching types', error });
    }
};

const UpdateType = async (req, res) => {
    const { id } = req.params;
    const { type_name } = req.body;

    try {
        await Type.findByIdAndUpdate(id, { type_name });
        res.status(200).json({ message: 'Type updated successfully' });
    } catch (error) {
        console.error('Error updating type:', error);
        res.status(500).json({ message: 'Error updating type', error });
    }
};

const DeleteType = async (req, res) => {
    const { id } = req.params;

    try {
        await Type.findByIdAndDelete(id);
        res.status(200).json({ message: 'Type deleted successfully' });
    } catch (error) {
        console.error('Error deleting type:', error);
        res.status(500).json({ message: 'Error deleting type', error });
    }
};

module.exports = { CreateType, FetchTypes, UpdateType, DeleteType };
