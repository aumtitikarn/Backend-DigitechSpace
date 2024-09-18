import { connectMongoDB } from "../../../lib/mongodb";
import Transaction from '../../../models/Getmoney';

export async function GET(req) {
  await connectMongoDB();

  try {
    const result = await Transaction.aggregate([
      {
        $project: {
          amount: 1,  // เลือกดึงฟิลด์ amount
          net: 1,     // เลือกดึงฟิลด์ net
          _id: 0      // ซ่อนฟิลด์ _id หากไม่ต้องการแสดง
        }
      }
    ]);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching data" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
