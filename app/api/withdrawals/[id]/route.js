import { connectMongoDB } from "../../../../lib/mongodb";
import Withdrawals from "../../../../models/withdrawals";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; 

// ฟังก์ชัน GET สำหรับดึงข้อมูลการถอนตาม ID
export async function GET(req, { params }) {
    const { id } = params; // ดึงค่า id จาก params
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB
    
    // ค้นหาการถอนที่มี _id ตรงกับ id ที่ส่งเข้ามา
    const post = await Withdrawals.findOne({ _id: id });
    
    // ส่งข้อมูลการถอนกลับในรูปแบบ JSON
    return NextResponse.json({ post }, { status: 200 });
}

// ฟังก์ชัน PUT สำหรับอัปเดตข้อมูลการถอนพร้อมกับสถานะ
export async function PUT(req, { params }) {
    const { id } = params; // ดึงค่า id จาก params
    const { newTitle: title, newImg: img, newContent: content, newStatus: status } = await req.json(); // รับข้อมูลจาก body
    
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB
    
    // อัปเดตข้อมูลในฐานข้อมูลรวมถึงสถานะใหม่
    await Withdrawals.findByIdAndUpdate(id, { title, img, content, status });

    // ส่งข้อความตอบกลับเมื่ออัปเดตเสร็จสิ้น
    return NextResponse.json({ message: "Post and status updated" }, { status: 200 });
}
export async function PATCH(req) {
    try {
        const urlParts = req.url.split('/');
        const id = urlParts[urlParts.length - 1];

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const { status } = await req.json();
        await connectMongoDB();

        // ตรวจสอบว่ามี status ที่ส่งเข้ามาหรือไม่
        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const updatedProject = await Withdrawals.findByIdAndUpdate(
            id,
            { status }, // อัปเดตเฉพาะ status
            { new: true }
        );

        if (!updatedProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Project updated", updatedProject }, { status: 200 });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}
  