const Snippet = require('../models/Snippet');

const FetchCodeSnippets = async (req, res) => {
    try {
        const snippets = await Snippet.find()
            .populate('language_id')  // Populate language data
            .populate('module_id')    // Populate module data
            .populate('type_id')      // Populate type data
            .populate('difficulty_id'); // Populate only difficult_level from Difficult collection

        res.status(200).json(snippets);
    } catch (error) {
        console.error('Error fetching snippets:', error);
        res.status(500).json({ message: 'Error fetching snippets', error });
    }
};

const FetchCodeSnippet2 = async (req, res) => {
    try {
        const { language, type, difficulty } = req.query;
        console.log('language:', language);
        console.log('type:', type);
        console.log('difficulty:', difficulty);

        // ตรวจสอบว่ามีการส่งค่า language, type, และ difficulty มาหรือไม่
        if (!language || !type || !difficulty) {
            return res.status(400).json({ error: 'กรุณาส่งค่า language, type และ difficulty' });
        }

        // ดึง snippet ทั้งหมดตาม language, type, และ difficulty ที่ได้รับ
        const snippets = await Snippet.find({ 
            language_id: language, 
            type_id: type, 
            difficulty_id: difficulty 
        });

        if (!snippets || snippets.length === 0) {
            return res.status(404).json({ error: 'ไม่พบ snippet ที่ตรงกับ language, type และ difficulty ที่เลือก' });
        }

        // สุ่มเลือก snippet หนึ่งจากรายการทั้งหมด
        const randomIndex = Math.floor(Math.random() * snippets.length);
        const randomSnippet = snippets[randomIndex];

        res.json(randomSnippet);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึง snippet:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
    }
};

const RandomCodeSnippet = async () => {
    try {
        // สมมติว่าเราดึงข้อมูลจากฐานข้อมูลโดยไม่ต้องการ req หรือ res
        const snippets = await Snippet.find()
            .populate('language_id')
            .populate('module_id')
            .populate('type_id')
            .populate('difficulty_id');

        if (snippets.length === 0) {
            throw new Error('No snippets found');
        }

        const randomIndex = Math.floor(Math.random() * snippets.length);
        return snippets[randomIndex];
    } catch (error) {
        console.error('Error fetching random snippet:', error);
        return null; // หรือคุณอาจจะต้องการจัดการข้อผิดพลาดในวิธีอื่น
    }
};




const CreateCodeSnippet = async (req, res) => {
    try {
        const { language_id, module_id, type_id, difficulty_id, snippet_text, result } = req.body;
        
        if (!language_id || !module_id || !type_id || !difficulty_id || !snippet_text || !result) {
          return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Create the new code snippet
        const newSnippet = new Snippet({ language_id, module_id, type_id, difficulty_id, snippet_text, result });
        await newSnippet.save();
        
        // Populate the fields for response
        const populatedSnippet = await Snippet.findById(newSnippet._id)
          .populate('language_id', 'language_name')
          .populate('module_id', 'module_name')
          .populate('type_id', 'type_name')
          .populate('difficulty_id', 'difficulty_level');
        
        res.json({ message: 'Code snippet added successfully', snippet: populatedSnippet });
      } catch (error) {
        console.error('Error adding code snippet:', error);
        res.status(500).json({ message: 'Error adding code snippet', error });
      }
};

const UpdateCodeSnippet = async (req, res) => {
    const  id  = req.params.id;
    const { snippet_text, result } = req.body;
    console.log('snippet_text:', snippet_text);
    console.log('result:', result);

    try {
        await Snippet.findByIdAndUpdate(id, { snippet_text, result });
        res.status(200).json({ message: 'Snippet updated successfully' });
    } catch (error) {
        console.error('Error updating snippet:', error);
        res.status(500).json({ message: 'Error updating snippet', error });
    }
};

const DeleteCodeSnippet = async (req, res) => {
    const { id } = req.params;

    try {
        await Snippet.findByIdAndDelete(id);
        res.status(200).json({ message: 'Snippet deleted successfully' });
    } catch (error) {
        console.error('Error deleting snippet:', error);
        res.status(500).json({ message: 'Error deleting snippet', error });
    }
};

module.exports = { CreateCodeSnippet, FetchCodeSnippets, FetchCodeSnippet2, RandomCodeSnippet, UpdateCodeSnippet, DeleteCodeSnippet };