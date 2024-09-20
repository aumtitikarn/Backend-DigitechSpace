// app/api/getreportblog/route.js
import { connectMongoDB } from "../../../lib/mongodb";
import blog from "../../../models/postblog";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
      const { name, username, report, more, time } = await req.json();
      await connectMongoDB();
      await blog.create({ name, username, report, more, time });
      return NextResponse.json({ message: "Blog Created" }, { status: 201 });
    } catch (error) {
      console.error("Error creating blog:", error);
      return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }

    
  }

  // export async function POST(req) {
  //   try {
  //     const { blogid, userEmail } = await req.json(); // Get the blog ID and user email from the request
  //     await connectMongoDB();
  
  //     const blogData = await blog.findById(blogid);
  //     if (!blogData) {
  //       return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  //     }
  
  //     // Email configuration using the provided user email as the sender
  //     const transporter = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //         user: userEmail, // The sender is now the user's email
  //         pass: process.env.EMAIL_PASS, // Password of the user's email (if you have their credentials, which is rare)
  //       },
  //     });
  
  //     const mailOptions = {
  //       from: userEmail, // Use the email provided by the user as the sender
  //       to: blogData.blogEmail, // The recipient email from MongoDB
  //       subject: `Notification for ${blogData.blogname}`,
  //       text: "Hello",
  //     };
  
  //     await transporter.sendMail(mailOptions);
  
  //     return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  //   }
  // }
  
export async function GET() {
  await connectMongoDB();
  const blogData = await blog.find({});
  console.log("Backend Data:", blogData); // Log the data to check its structure
  return NextResponse.json({ blogData }, { status: 200 }); // Ensure the structure matches the frontend expectation
}

