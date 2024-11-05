const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

const checkAdminAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; 
    //console.log('token:', token);
    
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // ตรวจสอบ role ของผู้ใช้
        if (verified.role !== 'admin') {
            return res.status(403).json({ message: 'Access Forbidden' });
        }

        // หาก token ถูกต้อง ให้เก็บข้อมูลผู้ใช้ใน req.user
        req.user = verified;
        next();
    } catch (error) {
        // จัดการข้อผิดพลาดต่าง ๆ ที่เกิดจากการตรวจสอบ token
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token. Please provide a valid token.' });
        } else {
            return res.status(500).json({ message: 'Internal server error.', error });
        }
    }
};

module.exports = { checkAdminAuth };
