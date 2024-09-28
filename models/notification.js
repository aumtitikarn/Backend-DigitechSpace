import mongoose from 'mongoose';

// สร้าง schema สำหรับ notification
const notificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  notifications: [{
    message: { type: String, required: true }, // เก็บข้อความแจ้งเตือน
    timestamp: { type: Date, default: Date.now } // เก็บเวลา
  }],
  addedAt: { type: Date, default: Date.now },
}, { timestamps: true }); // เพิ่ม timestamps

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
