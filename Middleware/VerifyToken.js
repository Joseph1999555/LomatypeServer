const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.error('No token provided');
    return res.status(403).json({ message: 'No token provided' });
  }

  // แยก 'Bearer' ออกจาก token
  const token = authHeader.split(' ')[1];

  if (!token) {
    console.error('Invalid token format');
    return res.status(403).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Failed to authenticate token:', err);
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    console.log('Token decoded successfully:', decoded);

    // ตั้งค่า req.userId จากข้อมูลที่ถอดรหัสมา
    req.userId = decoded.id;

    if (!req.userId) {
      console.error('No userId in token');
    } else {
      console.log('User ID extracted from token:', req.userId);
    }

    next();
  });
};

module.exports = { verifyToken };
