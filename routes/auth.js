const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../utils/passport');


// นำเข้า Login และ Register แยกกัน
const { Login, Register, ForgotPassword, ResetPassword, VerifyResetCode } = require('../controllers/LoginNRegister');

// ใช้ฟังก์ชัน Login และ Register เป็น callback
router.post('/login', Login);
router.post('/register', Register);
router.post('/forgot-password', ForgotPassword);
router.post('/verify-reset-code', VerifyResetCode);
router.post('/reset-password/:token', ResetPassword);

// Route เพื่อเข้าสู่ระบบด้วย Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
    
    // Redirect ไปยังหน้า login พร้อมแนบ token ไปใน query parameter
    res.redirect(`https://lomatypeclient.onrender.com/login?token=${token}`);
});


// Route ที่ใช้ตรวจสอบ token สำเร็จ
router.get('/success', (req, res) => {
    const token = req.query.token;
    res.json({ success: true, token });
});

module.exports = router;
