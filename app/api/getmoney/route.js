import { connectMongoDB } from "../../../lib/mongodb";
import orders from '../../../models/Getmoney';

export async function GET(req) {
  await connectMongoDB();
  console.log("MongoDB connected successfully.");

  try {
    // Fetch all orders
    const transactions = await orders.find({}).lean();
    console.log("Fetched transactions:", transactions); // Log transactions

    // Check if transactions array is empty
    if (transactions.length === 0) {
      console.log("No transactions found.");
    }

    // Debug: Log net values for each transaction
    transactions.forEach(order => {
      console.log(`Order net value: ${order.net}`);
    });

    // Calculate total sales by summing the 'net' field
    const totalSales = transactions.reduce((acc, order) => acc + order.net, 0);
    console.log("Total Sales:", totalSales);

    // Calculate total commission as 20% of net
    const totalCommission = transactions.reduce((acc, order) => {
      const commission = order.net * 0.2;
      console.log(`Commission for order (${order._id}): ${commission}`); // Debug each commission
      return acc + commission;
    }, 0);

    console.log("Total Commission (20% of Net):", totalCommission);

    return new Response(JSON.stringify({ totalSales, totalCommission }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return new Response(JSON.stringify({ message: "Error fetching data" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}