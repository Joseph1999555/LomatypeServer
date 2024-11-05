const TypingStat = require('../models/TypingStat');

// Create TypingStat with validation
const CreateTypingStat = async (req, res) => {
    const {
        user_id, code_snippet_id, typing_speed, typing_accuracy,
        typing_errors, typing_time, module_id, type_id,
        difficult_id, language_id
    } = req.body;

    console.log("stat", req.body); // ตรวจสอบข้อมูลที่ได้รับจาก client

    if (!user_id || !code_snippet_id || !typing_speed || !typing_accuracy || typing_errors === undefined || !typing_time) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const typingStat = new TypingStat({
        user_id,
        code_snippet_id,
        typing_speed: parseFloat(typing_speed),
        typing_accuracy: parseFloat(typing_accuracy), // แปลงเป็นตัวเลข
        typing_errors,
        typing_time,
        module_id,
        type_id,
        difficult_id,
        language_id
    });

    try {
        await typingStat.save();
        res.status(201).json(typingStat);
    } catch (error) {
        console.error('Error adding typing stat:', error);
        res.status(500).json({ message: 'Error adding typing stat', error });
    }
};



// Fetch TypingStats for logged-in user only
const FetchTypingStats = async (req, res) => {
    try {
        // user_id ที่ได้มาจาก token ผ่าน middleware ของ JWT
        const user_id = req.userId;

        const typingStats = await TypingStat.find({ user_id })
            .populate('user_id', 'username email') // แสดงเฉพาะ username และ email
            .populate('code_snippet_id', 'snippet_text') // แสดงเฉพาะ snippet_text
            .populate('module_id', 'module_name') // แสดงเฉพาะ module_name
            .populate('type_id', 'type_name') // แสดงเฉพาะ type_name
            .populate('difficult_id', 'difficult_level') // แสดงเฉพาะ difficulty_name
            .populate('language_id', 'language_name'); // แสดงเฉพาะ language_name

        res.status(200).json(typingStats);
    } catch (error) {
        console.error('Error fetching typing stats:', error);
        res.status(500).json({ message: 'Error fetching typing stats', error });
    }
};


// Fetch All TypingStats
const FetchAllTypingStats = async (req, res) => {
    try {
        const typingStats = await TypingStat.find()
            .populate('user_id', 'username') // แสดงเฉพาะ username และ email
            .populate('code_snippet_id', 'snippet_text') // แสดงเฉพาะ snippet_text
            .populate('module_id', 'module_name') // แสดงเฉพาะ module_name
            .populate('type_id', 'type_name') // แสดงเฉพาะ type_name
            .populate('difficult_id', 'difficult_level') // แสดงเฉพาะ difficulty_name
            .populate('language_id', 'language_name'); // แสดงเฉพาะ language_name

        res.status(200).json(typingStats);
        console.log('Typing stats:', typingStats);
    } catch (error) {
        console.error('Error fetching typing stats:', error);
        res.status(500).json({ message: 'Error fetching typing stats', error });
    }
};

const fetchLeaderboard = async (req, res) => {
    try {
        const leaderboard = await TypingStat.aggregate([
            {
                // จัดกลุ่มตาม user_id และหา typing_speed ที่สูงสุดของแต่ละคน
                $group: {
                    _id: "$user_id",
                    typing_speed: { $max: { $toDouble: "$typing_speed" } }, // แปลง typing_speed เป็น number
                    typing_accuracy: { $first: "$typing_accuracy" }, // เก็บค่า accuracy แรก
                    user_id: { $first: "$user_id" } // เก็บค่า user_id
                }
            },
            {
                // จัดเรียงตาม typing_speed จากมากไปน้อย
                $sort: { typing_speed: -1 }
            },
            {
                // จำกัดจำนวนแถวที่ต้องการแสดง (เช่น 10 คนแรก)
                $limit: 10
            }
        ]).exec();

        // Populate เพื่อดึง username ของ user
        const populatedLeaderboard = await TypingStat.populate(leaderboard, {
            path: "user_id",
            select: "username"
        });

        res.status(200).json(populatedLeaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Error fetching leaderboard', error });
    }
};



const DeleteTypingStat = async (req, res) => {
    const { id } = req.params;

    try {
        await TypingStat.findByIdAndDelete(id);
        res.status(200).json({ message: 'Typing stat deleted successfully' });
    } catch (error) {
        console.error('Error deleting typing stat:', error);
        res.status(500).json({ message: 'Error deleting typing stat', error });
    }
};

module.exports = { CreateTypingStat, FetchTypingStats, fetchLeaderboard, FetchAllTypingStats, DeleteTypingStat };