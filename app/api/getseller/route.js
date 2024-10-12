import { connectMongoDB } from "../../../lib/mongodb";
import { Order } from '../../../models/Getseller';
import { projects } from '../../../models/Getproject'

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch orders with status "successful"
    const orders = await Order.find({ status: 'successful' });
    console.log("Orders fetched: ", orders);

    // Check if there are any orders to process
    if (orders.length === 0) {
      return new Response(JSON.stringify({ message: 'No successful orders found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract product IDs from the orders
    const productIds = orders.map((order) => order.product);
    console.log("Product IDs from orders: ", productIds);

    // Fetch products that were sold based on the product IDs
    const products = await projects.find({ _id: { $in: productIds } });
    console.log("Fetched Products: ", products);

    // Check if any products were found
    if (products.length === 0) {
      return new Response(JSON.stringify({ message: 'No products found for the given product IDs' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prepare sales data with price, category, and createdAt
    const salesData = products.map((product) => {
      // Find the corresponding order for this product
      const correspondingOrder = orders.find(order => order.product.toString() === product._id.toString());
      
      return {
        price: product.price,
        category: product.category,
        createdAt: correspondingOrder ? correspondingOrder.createdAt : null // Use the createdAt from the corresponding order
      };
    });

    // Return the sales data as JSON with a 200 status
    return new Response(JSON.stringify(salesData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error during fetching:", error);

    // Return a 500 error if something goes wrong
    return new Response(JSON.stringify({ message: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
