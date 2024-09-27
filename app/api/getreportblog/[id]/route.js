import { connectMongoDB } from "../../../../lib/mongodb";
import blog from "../../../../models/postblog";
import Post from "../../../../models/posts";
import Notification from "../../../..//models/notification";
import { NextResponse } from "next/server";
import mongoose, { ObjectId } from 'mongoose';
import nodemailer from "nodemailer";

export async function POST(req,{params}) {
  try {

    const { id } = params; // ใช้ id ของ postblogs เพื่อค้นหา blogid
    await connectMongoDB();

    // ค้นหา blogid จากคอลเลกชัน postblogs
    const blogData = await blog.findById(id);
    
    if (!blogData) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    // const resetToken = crypto.randomBytes(20).toString("hex");
    // const resetPasswordExpires = Date.now() + 3600000; // หมดอายุใน 1 ชั่วโมง
    //   // บันทึก token ลงในฐานข้อมูล
    //   blogData.resetPasswordToken = resetToken;
    //   blogData.resetPasswordExpires = resetPasswordExpires;
      try {
        await blogData.save();
        console.log("Token saved for user:", blogData._id);
        console.log("Updated user object:", JSON.stringify(blogData, null, 2));
      } catch (saveError) {
        console.error("Error saving token:", saveError);
        throw saveError;
      }
  
      console.log("Token saved for user:", blogData._id);
  
      // const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      // const resetUrl = `${baseUrl}/auth/forgot/changePass?token=${resetToken}`;
  
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
            <p>Dear ${blogData.author},</p>
            <p>We have received requests from other users that your blog is inappropriate for our site.</p>
            <p>We will be removing your blog content soon.</p>
          </div>
        </body>
        </html>
      `;
  
      let info = await transporter.sendMail({
        from: '"Digitech Space" <digitechspace65@gmail.com>',
        to: blogData.blogEmail,
        subject: "Warnings from Digitech Space",
        text: `Dear ${blogData.blogname},TestReport`,
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
    //  const post = await db.collection('postblog').findOne({ _id: new ObjectId(id) });
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
      notification.notifications.push(notificationMessage);
      await notification.save();
    } else {
      // If no notification record exists, create a new one
      const newNotification = new Notification({
        email: blogData.blogEmail,
        notifications: [notificationMessage],
      });
      await newNotification.save();
    }

    return NextResponse.json({ message: "Post and blog deleted, and notification sent" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post or sending notification:", error);
    return NextResponse.json({ error: "Failed to delete post and send notification" }, { status: 500 });
  }
}