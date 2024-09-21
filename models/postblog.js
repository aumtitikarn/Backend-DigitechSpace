import mongoose, { Schema } from "mongoose";

const PostBlogSchema = new Schema(
  {
    _id: { type: String, required: true },
    blogname: { type: String, required: true }, // Blog name
    report: { type: String, required: true },   // Report content
    author: { type: String, required: true },   // Author of the report
    blogid: { type: String, required: true },   // ID of the blog being reported
    blogEmail: { type: String, required: true },// Email of the blog author
    selectedReason: {
      type: String,
      enum: [
        'มีคำไม่สุภาพ หรือ คำหยาบคาย',
        'เนื้อหาไม่ตรงกับหัวข้อ',
        'มีการโฆษณาสิ่งผิดกฎหมาย, เว็บพนัน, แชร์ลูกโซ่',
        'บทความไม่เกี่ยวข้องกับวิชาเรียน หรือมหาวิทยาลัย',
        'อื่นๆ',
      ],
      required: true, // Reason for reporting the blog
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt timestamps
);

// Export the model
const PostBlog = mongoose.models.PostBlog || mongoose.model("PostBlog", PostBlogSchema);
export default PostBlog;