import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  product: { type: String, required: true },
  amount: { type: Number, required: true },
  net: { type: Number, required: true },
  typec: { type: String, required: true },
  chargeId: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const orders = mongoose.models.orders || mongoose.model('orders', orderSchema);
export default orders;