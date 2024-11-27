import { connectMongoDB } from "../../../lib/mongodb";
import Reportprojet from "../../../models/reportprojet";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";


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
         <h2>Warning: Your project has been reported</h2>
<p>Dear ${author},</p>
<p>Your project titled "${name}" has been reported due to the following reason: ${report}. ${more}</p>
<p>We will remove your project content soon. If you believe this is a mistake or have any concerns, please contact us at digitechspace65@gmail.com.</p>
<p>Thank you for your understanding.</p>
        </div>
      </body>
      </html>
    `;

      const info = await transporter.sendMail({
          from: '"Digitech Space" <digitechspace65@gmail.com>',
          to: email,
          subject: "Warnings from Digitech Space",
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
export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { id } = await req.json(); // Assume the id of the report is sent in the request body

    if (!id) {
      return NextResponse.json({ msg: "ID is required" }, { status: 400 });
    }

    const deletedReport = await Reportprojet.findByIdAndDelete(id);

    if (!deletedReport) {
      return NextResponse.json({ msg: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { msg: "Error deleting report" },
      { status: 500 }
    );
  }
}
