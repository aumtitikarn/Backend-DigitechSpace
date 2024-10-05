import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import NormalUser from "../../../../models/NormalUser";
import StudentUser from "../../../../models/StudentUser";
import { getServerSession } from 'next-auth/next';
import { authOption } from '../../auth/[...nextauth]/route';

export async function GET(req) {
  try {
    // Connect to the database
    await connectMongoDB();

        // ดึงข้อมูล roleai จาก normalUsers และ studentUsers
        const normalUsers = await NormalUser.find({}, 'roleai');
        const studentUsers = await StudentUser.find({}, 'roleai');

        const normalUserCount = await NormalUser.countDocuments({});
        const studentUserCount = await StudentUser.countDocuments({});

        // รวมจำนวนผู้ใช้ทั้งหมด
        const totalUserCount = normalUserCount + studentUserCount;

    // รวมจำนวนผู้ใช้ทั้งหมด

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get order details for each project
    const purchaseHistory = await Promise.all(
        totalUserCount.map(async (totalUserCounts) => {
        // const order = await Order.findOne({ product: project._id, check: true });
        const normalUserCount = await NormalUser.countDocuments({});
        const studentUserCount = await StudentUser.countDocuments({});

        const totalUserCount = normalUserCount + studentUserCount;

        if (!totalUserCount) {
          
          return null;
        }

        return {
          date: totalUserCount.createdAt,
          roleai: totalUserCount.roleai,
        };
      })
    );

    // Filter out any null entries (projects without matching orders)
    const validPurchaseHistory = purchaseHistory.filter(entry => entry !== null);

    return NextResponse.json(validPurchaseHistory);
  } catch (error) {
    console.error('Error in getHistory:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}