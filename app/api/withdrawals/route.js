import { connectMongoDB } from "../../../lib/mongodb";
import Withdrawals from "../../../models/withdrawals";
import { NextResponse } from "next/server";

// ฟังก์ชัน POST สำหรับบันทึกการถอน
export async function POST(req) {
    const status = "pending"; 

    await connectMongoDB(); // เชื่อมต่อ MongoDB
    
    // บันทึกเฉพาะ status เข้าฐานข้อมูล
    await Withdrawals.create({ status });

    // ส่งข้อความตอบกลับ
    return NextResponse.json({ message: "Status saved as pending" }, { status: 201 });
}

// ฟังก์ชัน GET สำหรับดึงข้อมูลตาม id
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // ดึง id จาก query parameters

    await connectMongoDB();
    
    if (id) {
        // ค้นหาข้อมูลที่มี id เฉพาะเจาะจง
        const withdrawal = await Withdrawals.findById(id);
        if (!withdrawal) {
            return NextResponse.json({ message: "Withdrawal not found" }, { status: 404 });
        }
        return NextResponse.json(withdrawal); // ส่งข้อมูลของ withdrawal กลับไป
    } else {
        // หากไม่มี id ให้ค้นหาข้อมูลทั้งหมดที่ status เป็น "pending"
        const withdrawals = await Withdrawals.find({ status: "pending" });
        return NextResponse.json({ withdrawals });
    }
}
