const Module = require('../models/Module');

const CreateModule = async (req, res) => {
    const { name, description } = req.body; // เพิ่ม description
    console.log('CreateModule', name, description);
    // ตรวจสอบว่ามีการส่งข้อมูลที่จำเป็นทั้งหมด
    if (!name || !description) {
        return res.status(400).json({ message: 'Module name and description are required' });
    }

    const module = new Module({ module_name: name, module_description: description }); // เพิ่ม module_description

    try {
        await module.save();
        res.status(201).json(module);
    } catch (error) {
        console.error('Error adding module:', error);
        res.status(500).json({ message: 'Error adding module', error });
    }
};


const FetchModules = async (req, res) => {
    try {
        const modules = await Module.find();
        res.status(200).json(modules);
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ message: 'Error fetching module', error});
    }
};

const UpdateModule = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body; // เพิ่ม description
    console.log('UpdateModule', id, name, description);

    // ตรวจสอบว่ามีการส่งข้อมูลที่จำเป็นทั้งหมด
    if (!name || !description) {
        return res.status(400).json({ message: 'Module name and description are required' });
    }

    try {
        await Module.findByIdAndUpdate(id, { module_name: name, module_description: description }); // เพิ่ม module_description
        res.status(200).json({ message: 'Module updated successfully' });
    } catch (error) {
        console.error('Error updating module:', error);
        res.status(500).json({ message: 'Error updating module', error });
    }
};


const DeleteModule = async (req, res) => {
    const { id } = req.params;

    try {
        await Module.findByIdAndDelete(id);
        res.status(200).json({ message: 'Module deleted successfully' });
    } catch (error) {
        console.error('Error deleting module:', error);
        res.status(500).json({ message: 'Error deleting module', error });
    }
};

module.exports = { CreateModule, FetchModules, UpdateModule, DeleteModule };