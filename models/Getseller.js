import mongoose from 'mongoose';

// Check if the Order model is already compiled, if not, define it
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  email: String,
  name: String,
  product: mongoose.Schema.Types.ObjectId,
  amount: Number,
  net: Number,
  typec: String,
  chargeId: String,
  status: String,
  createdAt: Date,
}));

// Check if the Product model is already compiled, if not, define it
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
  imageUrl: Array,
  projectname: String,
  description: String,
  price: Number,
  author: String,
  email: String,
  receive: Array,
  category: String,
  filesUrl: Array,
  status: String,
}));

export { Order, Product };