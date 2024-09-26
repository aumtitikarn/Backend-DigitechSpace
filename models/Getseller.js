import mongoose from 'mongoose';

// Check if the Order model is already compiled, if not, define it
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  email: String,
  name: String,
  product: String,
  amount: Number,
  net: Number,
  typec: String,
  chargeId: String,
  status: String,
  createdAt: Date,
}));

export { Order };