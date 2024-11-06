const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: { type: String, required: function() { return !this.googleId; } }, // ถ้าไม่มี googleId จะต้องใช้ password
    role: {type: String, default: 'user'},
    googleId: { type: String, unique: true },
    resetCode: { type: String },               // เก็บรหัส 6 หลัก
	resetCodeExpires: { type: Date }            // เวลาหมดอายุของรหัสยืนยัน
});

// แปลงรหัสผ่านก่อนบันทึกลงฐานข้อมูล
UserSchema.pre('save', async function (next) {
    const user = this;

    // ถ้ารหัสผ่านไม่ได้ถูกแก้ไข ก็ข้ามไป
    if (!user.isModified('password')) return next();

    // แฮชรหัสผ่าน
    try {
        const salt = await bcrypt.genSalt(10); // สร้าง salt
        user.password = await bcrypt.hash(user.password, salt); // แฮชรหัสผ่าน
        next();
    } catch (err) {
        next(err);
    }
});

// ตรวจสอบรหัสผ่าน
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const user = this;
    return bcrypt.compare(candidatePassword, user.password); // เปรียบเทียบรหัสผ่าน
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
