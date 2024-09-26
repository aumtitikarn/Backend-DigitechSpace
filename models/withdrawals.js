import mongoose from 'mongoose';

const WithdrawSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ถ้ามีโมเดล User เชื่อมโยง
    required: true,
  },
  withdrawn: {
    type: Number,
    required: true,
  },
  net: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'], // สถานะที่อนุญาต
    default: 'pending',
  },
  receipt: {
    fullname: {
      type: String,
      required: true,
    },
    date: {
      type: String, // หรือ Date ขึ้นอยู่กับรูปแบบที่คุณต้องการ
      required: true,
    },
    gross: {
      type: Number,
      required: true,
    },
    withdrawable: {
      type: Number,
      required: true,
    },
    servicefee: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // จะสร้าง createdAt และ updatedAt อัตโนมัติ
});

// Export โมเดล
export default mongoose.models.Withdrawals || mongoose.model('Withdrawals', WithdrawSchema);
