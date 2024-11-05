const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail.js');
require('dotenv').config();

const Login =  async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // ใช้ secret จาก environment variable
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.log(error);
  }
};

const Register =  async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password, role });
    await user.save();

    // ใช้ secret จาก environment variable
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// ฟังก์ชันลืมรหัสผ่าน
const ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้." });

    // สร้างรหัสยืนยันแบบ 6 หลัก
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // เก็บรหัสยืนยันลงในฐานข้อมูลของผู้ใช้ พร้อมกำหนดเวลาให้หมดอายุภายใน 1 ชั่วโมง
    user.resetCode = verificationCode;
    user.resetCodeExpires = Date.now() + 3600000; // 1 ชั่วโมง
    await user.save();

    // ส่งอีเมลพร้อมรหัสยืนยัน
    await sendEmail(user.email, 'รหัสยืนยันการรีเซ็ตรหัสผ่าน', `รหัสยืนยันของคุณคือ: ${verificationCode}`);
    res.json({ message: "รหัสยืนยันถูกส่งไปยังอีเมลของคุณแล้ว." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ข้อผิดพลาดจากเซิร์ฟเวอร์', error });
  }
};

// ฟังก์ชันยืนยันรหัสยืนยันก่อนการรีเซ็ตรหัสผ่าน
const VerifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email, resetCode: code, resetCodeExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "รหัสยืนยันไม่ถูกต้องหรือหมดอายุ." });

    // หากรหัสยืนยันถูกต้อง สร้าง JWT token สำหรับไปยังหน้าเปลี่ยนรหัสผ่าน
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({ message: "รหัสยืนยันถูกต้อง", token: resetToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ข้อผิดพลาดจากเซิร์ฟเวอร์', error });
  }
};

// ฟังก์ชันรีเซ็ตรหัสผ่าน
const ResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // ตรวจสอบและถอดรหัส JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Token ไม่ถูกต้อง." });

    // ตั้งรหัสผ่านใหม่
    user.password = password;
    user.resetCode = undefined;  // ลบรหัสยืนยันออก
    user.resetCodeExpires = undefined;  // ลบเวลาหมดอายุของรหัสยืนยันออก
    await user.save();

    res.status(200).json({ message: "รีเซ็ตรหัสผ่านสำเร็จแล้ว." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ข้อผิดพลาดจากเซิร์ฟเวอร์', error });
  }
};
// ส่งออกฟังก์ชัน Login และ Register
module.exports = { Login, Register, ForgotPassword, ResetPassword, VerifyResetCode };