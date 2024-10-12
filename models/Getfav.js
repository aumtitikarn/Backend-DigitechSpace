import mongoose from 'mongoose';

// กำหนด schema ของ favorites
const favSchema = new mongoose.Schema({
    email: { type: String, required: true },
    projectId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'projects' }],
    addedAt: { type: Date, required: true },
});

// ตรวจสอบว่ามีโมเดล favorites อยู่แล้วหรือไม่ ถ้าไม่มีให้สร้างใหม่
const favorites = mongoose.models.favorites || mongoose.model('favorites', favSchema);

export { favorites };