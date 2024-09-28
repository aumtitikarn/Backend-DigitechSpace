import { connectMongoDB } from "../../../lib/mongodb";
import Withdrawals from "../../../models/withdrawals";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export async function POST(req) {
   
    try {
        const { id, email, fullname } = await req.json(); // ดึงข้อมูลจาก request body
        const status = "pending"; 
    
        // ตรวจสอบว่าข้อมูลที่จำเป็นมีครบหรือไม่
        if (!id || !email || !fullname) {
            return NextResponse.json({ message: "ID, email, and fullname are required" }, { status: 400 });
        }
    
        // เชื่อมต่อกับ MongoDB
        await connectMongoDB();

        // ตั้งค่าการส่ง email
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // เนื้อหาของ email
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Warning</title>
            <style>
                body { font-family: Arial, sans-serif; color: #000000; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .logo { text-align: center; margin-bottom: 20px; }
                .button { padding: 10px 20px; background-color: #33539B; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    <img src="https://m1r.ai/7ttM.png" alt="Logo" width="150">
                </div>
                <h2>Warning you have been Withdrawals </h2>
                <p>Dear ${fullname},</p>
              <p>We have reviewed your withdrawal and there is a problem with the data mismatch.</p>
              <p>We will cancel your withdrawal authorization soon. Please check your data correctly.</p>
            </div>
        </body>
        </html>
        `;

        // ส่ง email
        const info = await transporter.sendMail({
            from: '"Digitech Space" <digitechspace65@gmail.com>',
            to: email,
            subject: "Warning - Your Project is Withdrawals",
            html: htmlContent,
        });

        console.log("Message sent: %s", info.messageId);
        return NextResponse.json({ message: "Status saved as pending and email sent successfully." }, { status: 201 });
    } catch (error) {
        console.error("Error in creating withdrawal or sending email:", error);
        return NextResponse.json({ message: "An error occurred while processing your request." }, { status: 500 });
    }
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
