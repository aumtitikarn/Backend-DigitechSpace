import { connectMongoDB } from "../../../lib/mongodb";
import NormalUser from "../../../models/NormalUser";
import StudentUser from "../../../models/StudentUser";
import { NextResponse } from "next/server";

// เชื่อมต่อ MongoDB และดึงข้อมูล roleai
export async function GET(req) {
    try {
        await connectMongoDB();  // เชื่อมต่อ MongoDB

        // ดึงข้อมูล roleai จาก normalUsers และ studentUsers
        const normalUsers = await NormalUser.find({}, 'roleai');
        const studentUsers = await StudentUser.find({}, 'roleai');

        const normalUserCount = await NormalUser.countDocuments({});
        const studentUserCount = await StudentUser.countDocuments({});

        // รวมจำนวนผู้ใช้ทั้งหมด
        const totalUserCount = normalUserCount + studentUserCount;

        // ส่งข้อมูล roleai กลับไปยัง frontend
        return NextResponse.json({ normalUsers, studentUsers, totalUserCount}, { status: 200 });
    } catch (error) {
        console.error("Error fetching role data:", error);
        return NextResponse.json({ error: "Failed to fetch role data" }, { status: 500 });
    }
}