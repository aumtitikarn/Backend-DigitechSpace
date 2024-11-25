import { connectMongoDB } from "../../../../lib/mongodb";
import blog from "../../../../models/postblog";
import Post from "../../../../models/posts";
import Notification from "../../../../models/notification";
import Normalusers from "../../../../models/normalusers";
import Studentusers from "../../../../models/studentusers";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import nodemailer from "nodemailer";

export async function POST(req, { params }) {
  try {
    const { id } = params; // ใช้ id ของ postblogs เพื่อค้นหา blogid
    await connectMongoDB();

    // ค้นหา blogid จากคอลเลกชัน postblogs
    const blogData = await blog.findById(id);

    if (!blogData) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // ค้นหาผู้ใช้ใน students และ normalusers
    let user = await Studentusers.findOne({ email: blogData.blogEmail });
    let userType = "studentusers";

    if (!user) {
      user = await Normalusers.findOne({ email: blogData.blogEmail });
      userType = "normalusers";
    }

    // หากไม่พบผู้ใช้ในทั้งสองคอลเลกชัน
    if (!user) {
      return NextResponse.json(
        { message: "User not found in both collections" },
        { status: 404 }
      );
    }

    // แสดงประเภทผู้ใช้และชื่อผู้ใช้
    console.log("User type:", userType);
    console.log("Username found:", user.name);
    console.log("Blog data:", blogData);

    // แสดงข้อมูลก่อนจะส่งอีเมล
    console.log("Sending warning email...");
    console.log("Blog title: ", blogData.blogname);
    console.log("Reported reason: ", blogData.report);
    console.log("Email recipient: ", blogData.blogEmail);

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
         <h2>Warning: Your blog has been reported</h2>
    <p>Dear ${user.name},</p>
    <p>Your blog titled "${blogData.blogname}" has been reported due to the following reason: ${blogData.report}. ${blogData.selectedReason}</p>
    <p>We will remove your blog content soon. If you believe this is a mistake or have any concerns, please contact us at  digitechspace65@gmail.com..</p>
    <p>Thank you for your understanding.</p>
      </div>
    </body>
    </html>
    `;

    let info = await transporter.sendMail({
      from: '"Digitech Space" <digitechspace65@gmail.com>', // จากผู้ส่ง
      to: blogData.blogEmail, // ผู้รับ
      subject: "Warnings from Digitech Space", // หัวข้อ
      html: htmlContent, // เนื้อหาในรูปแบบ HTML
    });
// แสดงผลลัพธ์การส่งอีเมล
console.log("Message sent: %s", info.messageId);
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


export async function GET(req, { params }) {
  const { id } = params;

  console.log("Received id:", id);

  // Check if the ID is valid
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.error('Invalid ID:', id);
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  try {
    await connectMongoDB();

    const allPosts = await blog.find({});
    console.log("All posts:", allPosts);
    const post = await blog.findOne({ _id: new mongoose.Types.ObjectId(id) });

    console.log("get id backend :",id)
    console.log("get post backend :",post)
    
    if (!post) {
      console.log(`Post not found for ID: ${id}`);
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ message: 'Error fetching post' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { newTitle: title, newImg: img, newContent: content } = await req.json();

    await connectMongoDB();

    const updatedPost = await PostBlog.findByIdAndUpdate(
      id,
      { title, img, content },
      { new: true } // This option returns the updated document
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post updated", updatedPost }, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params; // ใช้ id ของ postblogs เพื่อค้นหา blogid
    await connectMongoDB();

    // ค้นหา blogid จากคอลเลกชัน postblogs
    const blogData = await blog.findById(id);
    
    if (!blogData) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // ค้นหาและลบโพสต์จากคอลเลกชัน posts โดยใช้ blogid
    const deletedPost = await Post.findByIdAndDelete(blogData.blogid);
    
    if (!deletedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Notify the owner of the blog
    const notificationMessage = `Your blog titled "${blogData.blogname}" has been deleted.`;
    
    // Check if a notification record exists for this email
    const notification = await Notification.findOne({ email: blogData.blogEmail });

    if (notification) {
      // Add the new message to the existing notifications array
      notification.notifications.message.push(notificationMessage);
      notification.notifications.times.push(new Date()); // เพิ่ม times ด้วยวันที่ปัจจุบัน
      await notification.save();
    } else {
      // If no notification record exists, create a new one
      const newNotification = new Notification({
        email: blogData.blogEmail,
        notifications: {
          message: [notificationMessage],
          times: [new Date()], // เพิ่ม times ด้วยวันที่ปัจจุบัน
        },
      });
      await newNotification.save();
    }

    return NextResponse.json({ message: "Post and blog deleted, and notification sent" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post or sending notification:", error);
    return NextResponse.json({ error: "Failed to delete post and send notification" }, { status: 500 });
  }
}