import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  amount: { type: Number, required: true },
  net: { type: Number, required: true },
  typec: { type: String, required: true },
  chargeId: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default Transaction;
