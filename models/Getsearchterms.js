import mongoose from 'mongoose';

// กำหนด schema ของ searchterms
const searchTermSchema = new mongoose.Schema({
  term: { type: String, required: true }, // ฟิลด์คำค้นหาที่จำเป็นต้องมี
  count: { type: Number, required: true }, // ฟิลด์จำนวนครั้งที่ค้นหา
  lastSearched: { type: Date, default: Date.now }, // ฟิลด์วันที่ของการค้นหาครั้งล่าสุด (ค่าดีฟอลต์เป็นปัจจุบัน)
});

// ตรวจสอบว่ามีโมเดล searchterms อยู่แล้วหรือไม่ ถ้าไม่มีให้สร้างใหม่
const searchterms = mongoose.models.searchterms || mongoose.model('searchterms', searchTermSchema);

console.log("search form database :",searchterms)

export { searchterms };