import { connectMongoDB } from "../../../../lib/mongodb";
import PostSer from "../../../../models/postservice";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req, { params }) {
    const { id } = params;
    await connectMongoDB();
    const post = await PostSer.findOne({ _id: id });
    return NextResponse.json({ post }, { status: 200 });
}

export async function POST(req,{params}) {
    try {
  
      const { id } = params; // ใช้ id ของ postblogs เพื่อค้นหา blogid
      await connectMongoDB();
  
      // ค้นหา blogid จากคอลเลกชัน postblogs
      const blogData = await PostSer.findById(id);
      
      if (!blogData) {
        return NextResponse.json({ message: "Blog not found" }, { status: 404 });
      }

        try {
          await blogData.save();
          console.log("Token saved for user:", blogData._id);
          console.log("Updated user object:", JSON.stringify(blogData, null, 2));
        } catch (saveError) {
          console.error("Error saving token:", saveError);
          throw saveError;
        }
    
        console.log("Token saved for user:", blogData._id);
    
        // ตั้งค่า transporter
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });
    
        // HTML template for the email
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
              <h2>Warning you have been reported</h2>
              <p>Dear ${blogData.username},</p>
              <p>We have received requests from other users that your blog is inappropriate for our site.</p>
              <p>We will be removing your blog content soon.</p>
            </div>
          </body>
          </html>
        `;
    
        let info = await transporter.sendMail({
          from: '"Digitech Space" <digitechspace65@gmail.com>',
          to: blogData.email,
          subject: "Warnings from Digitech Space",
          text: `Dear ${blogData.username},TestReport`,
          html: htmlContent,
        });
  
        return NextResponse.json(
          { message: "Password reset email sent successfully." },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json(
          { message: "An error occurred while sending the password reset email." },
          { status: 500 }
        );
      }
  }