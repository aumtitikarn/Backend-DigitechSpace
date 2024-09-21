import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    topic: { type: String, required: true },           // ชื่อหัวข้อของโพสต์
    course: { type: String, required: true },          // คอร์สที่เกี่ยวข้อง
    description: { type: String, required: true },     // รายละเอียดโพสต์
    heart: { type: Number, default: 0 },               // จำนวนการถูกใจ
    imageUrl: { type: [String], default: [] },         // รูปภาพของโพสต์
    userprofile: { type: [String], default: [] },      // โปรไฟล์ผู้ใช้
    author: { type: String, required: true },          // ชื่อผู้เขียน
    comments: { type: [String], default: [] },         // คอมเมนต์
    selectedCategory: { type: String, required: true },// หมวดหมู่ของโพสต์
    email: { type: String },                           // อีเมลผู้เขียน (ไม่บังคับ)
  },
  { timestamps: true } // จัดการ createdAt และ updatedAt อัตโนมัติ
);

// ตรวจสอบว่า model นี้ถูกสร้างไปแล้วหรือไม่ เพื่อป้องกันการสร้างซ้ำ
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;