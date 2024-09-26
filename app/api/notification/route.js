import { connectMongoDB } from "../../../lib/mongodb";
import Notification from "../../../models/notification";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email, message } = await request.json(); // Get email and message from the request body
  
        await connectMongoDB(); // Ensure you connect to the database
  
        // ค้นหาผู้ใช้ตาม email
        const notification = await Notification.findOne({ email });
  
        if (notification) {
            // ถ้ามีแล้ว ให้เพิ่มข้อความแจ้งเตือนไปยังอาเรย์
            notification.notifications.push(message); // เพิ่มข้อความใหม่โดยไม่ต้องเช็คว่า notifications เป็น undefined
            await notification.save(); // บันทึกการเปลี่ยนแปลง
            console.log("Notification added:", notification.notifications);
            return NextResponse.json({ message: "Notification added successfully" }, { status: 200 });
        } else {
            // ถ้ายังไม่มี ให้สร้างเอกสารใหม่
            const newNotification = new Notification({
                email,
                notifications: [],
            });
            await newNotification.save(); // บันทึกเอกสารใหม่
            console.log("New notification created:", newNotification);
            return NextResponse.json({ message: "New notification created successfully" }, { status: 201 });
        }
    } catch (error) {
        console.error("Error adding notification:", error);
        return NextResponse.json({ message: "Error adding notification" }, { status: 500 });
    }
}
