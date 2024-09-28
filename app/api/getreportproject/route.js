import { connectMongoDB } from "../../../lib/mongodb";
import Reportprojet from "../../../models/reportprojet";
import Project from "../../../models/projects";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Function to handle POST request
// Function to handle POST request
export async function POST(req) {
  try {
      const { id, email, author, name, username, report, more } = await req.json(); 

      // Validate required fields
      if (!id || !email || !author) {
          return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
      }

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
          <p>Dear ${author},</p>
          <p>We have received a request from another user that your project is not suitable for our site.</p>
          <p>We will remove your project content soon.</p>
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

      // ลบ project จากคอลเลกชัน Reportprojet
      console.log("Deleting project with projectId:", projectId);
      const deletedReport = await Reportprojet.findOneAndDelete({ projectId });

      if (!deletedReport) {
          console.error("Project not found in Reportprojet for projectId:", projectId);
          return NextResponse.json({ msg: "Project not found in Reportprojet" }, { status: 404 });
      }

      // ลบ project จากคอลเลกชัน projects โดยตรวจสอบ _id ตรงกับ projectId
      const deletedProject = await Project.findByIdAndDelete(projectId);

      if (!deletedProject) {
          console.error("Project not found in projects for _id:", projectId);
          return NextResponse.json({ msg: "Project not found in projects" }, { status: 404 });
      }

      console.log("Project deleted successfully from both collections");
      return NextResponse.json({ message: "Project deleted successfully from both collections" }, { status: 200 });
  } catch (error) {
      console.error("Error in DELETE handler:", error);
      return NextResponse.json({ msg: "Error deleting project" }, { status: 500 });
  }
}