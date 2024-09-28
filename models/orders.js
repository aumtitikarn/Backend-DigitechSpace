// orders.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // กำหนดโครงสร้างข้อมูลที่นี่
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project" },
    // เพิ่มฟิลด์อื่นๆ ที่ต้องการ
});

export default mongoose.models.Orders || mongoose.model("Orders", orderSchema);
