import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectMongoDB } from "../../../lib/mongodb";
import Studentuser from "../../../models/StudentUser";
import Normaluser from "../../../models/NormalUser";

export async function POST(request) {
  try {
    const { email, subject, emailContent } = await request.json();
    console.log("Received email request for:", email);

    await connectMongoDB();

    // ค้นหาผู้ใช้
    let user = await Normaluser.findOne({ email });
    if (!user) {
      user = await Studentuser.findOne({ email });
    }

    if (!user) {
      console.log("User not found for email:", email);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("User found:", user._id);

    // กำหนดค่า userName
    const userName = user.name || user.firstname || "User";

    // สร้าง HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #000000;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .logo { 
            text-align: center; 
            margin-bottom: 20px; 
          }
          .button { 
            display: inline-block; 
            padding: 10px 20px; 
            background-color: #33539B; 
            color: #ffffff !important;
            text-decoration: none; 
            border-radius: 5px; 
            font-weight: bold; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://m1r.ai/7ttM.png" alt="Digitech Space Logo" width="150">
          </div>
          <h2>${subject}</h2>
          <p>Dear ${userName},</p>
          <p>${emailContent}</p>
          <p>If you need any assistance, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The Digitech Space Team</p>
        </div>
      </body>
      </html>
    `;

    // ตั้งค่า transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // ส่งอีเมล
    let info = await transporter.sendMail({
      from: '"Digitech Space" <digitechspace65@gmail.com>',
      to: email,
      subject: subject,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);

    return NextResponse.json(
      { message: "Email sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "An error occurred while sending the email." },
      { status: 500 }
    );
  }
}