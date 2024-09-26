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

        if (notifications) {
            notifications.notifications.push(notificationValue); // เพิ่มข้อความใหม่
            await notifications.save();
            return new NextResponse(JSON.stringify({ message: "Notification added successfully" }), { status: 200 });
        } else {
            const newNotification = new Notification({
                email,
                notifications: [notificationValue],
            });
            await newNotification.save();
            return new NextResponse(JSON.stringify({ message: "New notification created successfully" }), { status: 201 });
        }
    } catch (error) {
        console.error("Error adding notification:", error.message);
        return new NextResponse(JSON.stringify({ error: `Error adding notification: ${error.message}` }), { status: 500 });
    }
};
