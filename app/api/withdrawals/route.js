import { connectMongoDB } from "../../../lib/mongodb";
import Withdrawals from "../../../models/withdrawals";
import { NextResponse } from "next/server";

// ฟังก์ชัน POST สำหรับบันทึกการถอน
export async function POST(req) {
    // กำหนดค่า status เป็น "pending"
    const status = "pending"; 

    await connectMongoDB(); // เชื่อมต่อ MongoDB
    
    // บันทึกเฉพาะ status เข้าฐานข้อมูล
    await Withdrawals.create({ status });

    // ส่งข้อความตอบกลับ
    return NextResponse.json({ message: "Status saved as pending" }, { status: 201 });
}

// ฟังก์ชัน GET สำหรับดึงข้อมูลที่มีสถานะ pending
export async function GET() {
    await connectMongoDB();
    
    // ค้นหาเฉพาะข้อมูลที่ status เป็น "pending"
    const withdrawals = await Withdrawals.find({ status: "pending" });
    
    // ส่งข้อมูลกลับในรูปแบบ JSON
    return NextResponse.json({ withdrawals });
}
