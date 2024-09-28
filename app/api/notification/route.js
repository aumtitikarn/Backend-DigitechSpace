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
        // ตรวจสอบว่า Notification มีอยู่แล้วหรือไม่
        let notification = await Notification.findOne({ email });

        const notificationData = {
            message: notificationValue, // เก็บข้อความแจ้งเตือน
            timestamp: new Date(), // เก็บเวลาที่บันทึก
        };

        console.log("Notification data to be added:", JSON.stringify(notificationData, null, 2));

        if (notification) {
            // หากมีอยู่แล้ว ให้ปรับปรุงข้อมูลแจ้งเตือน
            if (!notification.notifications) {
                // หาก notifications ไม่ถูกกำหนด ให้สร้างอ็อบเจ็กต์ notifications ใหม่
                notification.notifications = {
                    message: [],
                    times: [],
                };
            }
            // ตรวจสอบว่า message และ times ถูกกำหนดให้เป็นอาเรย์
            if (!Array.isArray(notification.notifications.message)) {
                notification.notifications.message = [];
            }
            if (!Array.isArray(notification.notifications.times)) {
                notification.notifications.times = [];
            }

            // เพิ่มข้อความและเวลาเข้าไปในอาเรย์
            notification.notifications.message.push(notificationData.message);
            notification.notifications.times.push(notificationData.timestamp);
        } else {
            // ถ้าไม่มี ให้สร้างใหม่
            notification = new Notification({
                email,
                notifications: {
                    message: [notificationData.message],
                    times: [notificationData.timestamp],
                },
            });
        }

        console.log("Notifications object before saving:", JSON.stringify(notification, null, 2));

        await notification.save(); // บันทึกการเปลี่ยนแปลง
        return new NextResponse(JSON.stringify({ message: "Notification added successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error adding notification:", error.message);
        return new NextResponse(JSON.stringify({ error: `Error adding notification: ${error.message}` }), { status: 500 });
    }
};
