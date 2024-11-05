const Difficult = require('../models/Difficult');

const CreateDifficulty = async (req, res) => {
    const { name } = req.body;
    const difficulty = new Difficult({ difficult_level: name });

    try {
        await difficulty.save();
        res.status(201).json(difficulty);
    } catch (error) {
        console.error('Error adding difficulty:', error);
        res.status(500).json({ message: 'Error adding difficulty', error });
    }
};

const FetchDifficulties = async (req, res) => {
    try {
        const difficulties = await Difficult.find();

        // กำหนดลำดับที่ต้องการ
        const order = ["easy", "medium", "hard"];
        
        // จัดเรียง difficulties ตามลำดับที่กำหนด
        const sortedDifficulties = difficulties.sort((a, b) => {
            return order.indexOf(a.difficult_level) - order.indexOf(b.difficult_level);
        });

        res.status(200).json(sortedDifficulties);
    } catch (error) {
        console.error('Error fetching difficulties:', error);
        res.status(500).json({ message: 'Error fetching difficulties', error });
    }
};


const UpdateDifficulty = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        await Difficult.findByIdAndUpdate(id, { difficult_level: name });
        res.status(200).json({ message: 'Difficulty updated successfully' });
    } catch (error) {
        console.error('Error updating difficulty:', error);
        res.status(500).json({ message: 'Error updating difficulty', error });
    }
};

const DeleteDifficulty = async (req, res) => {
    const { id } = req.params;

    try {
        await Difficult.findByIdAndDelete(id);
        res.status(200).json({ message: 'Difficulty deleted successfully' });
    } catch (error) {
        console.error('Error deleting difficulty:', error);
        res.status(500).json({ message: 'Error deleting difficulty', error });
    }
};

module.exports = { CreateDifficulty, FetchDifficulties, UpdateDifficulty, DeleteDifficulty };