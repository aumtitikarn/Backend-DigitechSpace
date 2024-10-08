import { connectMongoDB } from "../../../lib/mongodb";
import NormalUser from "../../../models/NormalUser";
import StudentUser from "../../../models/StudentUser";
import { NextResponse } from "next/server";

// เชื่อมต่อ MongoDB และดึงข้อมูล roleai
export async function GET(req) {
    try {
        await connectMongoDB();  // เชื่อมต่อ MongoDB

        const url = new URL(req.url);
        const selectedMonth = url.searchParams.get('month'); // รับค่าจาก query params
        const selectedYear = url.searchParams.get('year'); // รับค่าจาก query params

        // กำหนด filter สำหรับ NormalUser และ StudentUser
        let normalUserFilter = {};
        let studentUserFilter = {};

        // ตรวจสอบค่าที่เลือก
        if (selectedMonth !== "All" && selectedYear !== "All") {
            const startDate = new Date(`${selectedYear}-${selectedMonth}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1); // ไปจนถึงสิ้นเดือน
            
            normalUserFilter = { createdAt: { $gte: startDate, $lt: endDate } };
            studentUserFilter = { createdAt: { $gte: startDate, $lt: endDate } };
        }

        // ดึงข้อมูล roleai จาก normalUsers และ studentUsers ตาม filter ที่กำหนด
        const normalUsers = await NormalUser.find(normalUserFilter, 'roleai');
        const studentUsers = await StudentUser.find(studentUserFilter, 'roleai');

        const normalUserCount = await NormalUser.countDocuments(normalUserFilter);
        const studentUserCount = await StudentUser.countDocuments(studentUserFilter);

        // รวมจำนวนผู้ใช้ทั้งหมด
        const totalUserCount = normalUserCount + studentUserCount;

        // ส่งข้อมูล roleai กลับไปยัง frontend
        return NextResponse.json({ normalUsers, studentUsers, totalUserCount }, { status: 200 });
    } catch (error) {
        console.error("Error fetching role data:", error);
        return NextResponse.json({ error: "Failed to fetch role data" }, { status: 500 });
    }
}
