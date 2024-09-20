import mongoose from 'mongoose';

// Check if the Order model is already compiled, if not, define it
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  email: String,
  name: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // กำหนดว่าเป็น ObjectId และเชื่อมโยงกับ Product
  amount: Number,
  net: Number,
  typec: String,
  chargeId: String,
  status: String,
  createdAt: Date,
}));

export { Order };