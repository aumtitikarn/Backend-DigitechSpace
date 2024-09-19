import { connectMongoDB } from "../../../lib/mongodb";
import { Order, Product } from '../../../models/Getseller';

// API to get orders and products
export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch orders with status "successful"
    const orders = await Order.find({ status: 'successful' });

    // Extract product IDs from the orders
    const productIds = orders.map((order) => order.product);

    // Fetch products that were sold
    const products = await Product.find({ _id: { $in: productIds } });

    // Prepare sales data with price and category
    const salesData = products.map((product) => ({
      price: product.price,
      category: product.category,
    }));

    // Return the sales data as JSON with a 200 status
    return new Response(JSON.stringify(salesData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);

    // Return a 500 error if something goes wrong
    return new Response(JSON.stringify({ message: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}