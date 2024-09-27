import { connectMongoDB } from "../../../lib/mongodb";
import Reportprojet from "../../../models/reportprojet";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Function to handle POST request
export async function POST(req) {
    try {
        const { name, username, report, more, time, email, projectId, author } = await req.json(); 

        // Validate required fields
        if (!name || !username || !report || !email || !projectId) {
            return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
        }

        await connectMongoDB();
        await Reportprojet.create({ name, username, report, more, time, projectId, author });

        // Set up the transporter
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
          <title>Password Reset Request</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #000000; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .logo { text-align: center; margin-bottom: 20px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #33539B; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://m1r.ai/7ttM.png" alt="Digitech Space Logo" width="150">
            </div>
            <h2>Password Reset Request</h2>
            <p>Dear ${author},</p>
            <p>We have received a request to reset the password for your Digitech Space account. If you did not make this request, please ignore this email.</p>
            <p>To reset your password, please click the button below:</p>
            <p style="text-align: center;">
              <a class="button" href="#">Reset Password</a>
            </p>
            <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
            <p>TestJUBBB</p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you need any assistance, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>The Digitech Space Team</p>
          </div>
        </body>
        </html>
      `;

await transporter.sendMail({
  from: '"Digitech Space" <digitechspace65@gmail.com>',
  to: email,
  subject: "Contact from Project Viewer",
  html: htmlContent,
});
        console.log("Message sent: %s", info.messageId);
        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ msg: "Failed to send email", error: error.message }, { status: 500 });
    }
}

// Function to handle GET request
export async function GET() {
    try {
        await connectMongoDB();
        const projectData = await Reportprojet.find({});
        console.log("Backend Data:", projectData);
        return NextResponse.json({ projectData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

// Function to handle DELETE request
export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { projectId } = await req.json();

        // Validate projectId
        if (!projectId) {
            return NextResponse.json({ msg: "Missing projectId" }, { status: 400 });
        }

        console.log("Deleting project with projectId:", projectId);
        const deletedPost = await Reportprojet.findOneAndDelete({ projectId });

        if (!deletedPost) {
            console.error("Project not found for projectId:", projectId);
            return NextResponse.json({ msg: "Project not found" }, { status: 404 });
        }

        console.log("Project deleted successfully:", deletedPost);
        return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in DELETE handler:", error);
        return NextResponse.json({ msg: "Error deleting project" }, { status: 500 });
    }
}
