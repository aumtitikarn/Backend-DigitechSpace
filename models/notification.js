import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  email: {
      type: String,
      required: true,
      unique: true,
  },
  notifications: {
      message: {
          type: [String], // เปลี่ยนเป็น Array ของ String
          required: true,
          default: [], // กำหนดค่าเริ่มต้นเป็น Array ว่าง
      },
      times: {
          type: [Date], // เปลี่ยนเป็น Array ของ Date
          required: true,
          default: [], // กำหนดค่าเริ่มต้นเป็น Array ว่าง
      },
  },
}, {
  timestamps: true,
});


export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
