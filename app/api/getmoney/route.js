import { connectMongoDB } from "../../../lib/mongodb";
import orders from '../../../models/Getmoney';

export async function GET(req) {
  await connectMongoDB();
  console.log("MongoDB connected successfully.");

  try {
    // Fetch all orders
    const transactions = await orders.find({}).lean();
    console.log("Fetched transactions:", transactions); // Log transactions

    if (transactions.length === 0) {
      console.log("No transactions found.");
    }

    transactions.forEach(order => {
      console.log(`Order net value: ${order.net}, createdAt: ${order.createdAt}`);
    });

    const totalSales = transactions.reduce((acc, order) => acc + order.net, 0);
    console.log("Total Sales:", totalSales);

    const totalCommission = transactions.reduce((acc, order) => {
      const commission = order.net * 0.2;
      console.log(`Commission for order (${order._id}): ${commission}`);
      return acc + commission;
    }, 0);

    // ส่ง transactions กลับไปด้วย โดยมี createdAt เพื่อใช้หาเดือนและปี
    return new Response(JSON.stringify({ totalSales, totalCommission, transactions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return new Response(JSON.stringify({ message: "Error fetching data", error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}