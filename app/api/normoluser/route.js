import { connectMongoDB } from "../../../lib/mongodb";
import Normalusers from "../../../models/normalusers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer"; // ตรวจสอบให้แน่ใจว่านำเข้า nodemailer

export async function POST(req) {
    const { name, email } = await req.json(); // Include message
    console.log(name, email); // Log the message for debugging
    
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Warnings from</title>
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
            <h2>Notification message</h2>
            <p>Dear ${name},</p>
            <p>Message from the website:</p> <!-- Include the message here -->
          </div>
        </body>
        </html>
    `;
    

        const info = await transporter.sendMail({
            from: '"Digitech Space" <digitechspace65@gmail.com>',
            to: email,
            subject: "Contact from Project Viewer",
            html: htmlContent,
        });

        console.log("Message sent: %s", info.messageId);
        
        await connectMongoDB();
        await Normalusers.create({ name, email });
        return NextResponse.json({ message: "Normalusers Test" }, { status: 201 });
    } catch (error) {
        console.error("Error sending email or saving user: ", error);
        return NextResponse.json({ message: "Failed to send email or save user." }, { status: 500 });
    }
}

export async function GET() {
    await connectMongoDB();
    const normalusers = await Normalusers.find({});
    return NextResponse.json({ normalusers });
}
