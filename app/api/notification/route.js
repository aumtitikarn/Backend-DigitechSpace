import { connectMongoDB } from "../../../lib/mongodb";
import Notification from "../../../models/notification";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    await connectMongoDB();

    const { email, notificationValue } = await req.json(); // รับ email และ notificationValue

    if (!email || !notificationValue) {
        return new NextResponse(JSON.stringify({ error: "Missing required fields: email or notificationValue" }), { status: 400 });
    }

    try {
        const notifications = await Notification.findOne({ email });

        const notificationData = {
            message: notificationValue, // เก็บข้อความแจ้งเตือน
            timestamp: new Date(), // เก็บเวลาในตอนที่เพิ่ม
        };

        if (notifications) {
            // ถ้ามี notifications อยู่แล้ว ก็เพิ่มข้อความใหม่เข้าไป
            notifications.notifications.push(notificationData);
            await notifications.save(); // บันทึกการเปลี่ยนแปลง
            return new NextResponse(JSON.stringify({ message: "Notification added successfully" }), { status: 200 });
        } else {
            // ถ้าไม่มี notifications ให้สร้างใหม่
            const newNotification = new Notification({
                email,
                notifications: [notificationData], // เพิ่ม notificationData เป็น array
            });
            await newNotification.save(); // บันทึกการสร้าง notification ใหม่
            return new NextResponse(JSON.stringify({ message: "New notification created successfully" }), { status: 201 });
        }
    } catch (error) {
        console.error("Error adding notification:", error.message);
        return new NextResponse(JSON.stringify({ error: `Error adding notification: ${error.message}` }), { status: 500 });
    }
};
