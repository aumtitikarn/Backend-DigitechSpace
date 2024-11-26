import { connectMongoDB } from "../../../lib/mongodb";
import Reportprojet from "../../../models/reportprojet";
import Project from "../../../models/projects";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Order from "../../../models/orders"; 
import Favorites from "../../../models/favorites";

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

// Function to handle DELETE request
export async function DELETE(req) {
  try {
    // Connect to the MongoDB database
    await connectMongoDB();

    // Extract the projectId from the request body
    const { projectId } = await req.json();

    // Validate if the projectId exists
    if (!projectId) {
      return NextResponse.json({ msg: "Missing projectId" }, { status: 400 });
    }

    console.log("Deleting project and associated data with projectId:", projectId);

    // 1. Delete related reports in Reportprojet
    const deletedReportprojet = await Reportprojet.deleteMany({ projectId });
    console.log("Deleted reports:", deletedReportprojet.deletedCount);

    // 2. Update matching orders in Orders collection to set status to 'delete'
    const updatedOrders = await Order.updateMany(
      { product: projectId }, // ค้นหาคำสั่งที่ตรงกับ projectId
      { status: 'delete' } // เปลี่ยนสถานะเป็น 'delete'
    );
    console.log("Updated orders to 'delete':", updatedOrders.modifiedCount);

    // 3. Remove projectId from Favorites collection using $pull
    const deletedFavorites = await Favorites.updateMany(
      {},
      { $pull: { projectId: projectId } }
    );
    console.log("Updated favorites:", deletedFavorites.modifiedCount);

    // 4. Delete project from projects collection
    const deletedProject = await Project.findOneAndDelete({ _id: projectId });

    // Check if the project was found and deleted
    if (!deletedProject) {
      console.error("Project not found in projects for _id:", projectId);
      return NextResponse.json({ msg: "Project not found in projects" }, { status: 404 });
    }

    console.log("Project and associated data deleted successfully");
    return NextResponse.json({ message: "Project and associated data deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json({ msg: "Error deleting project and associated data", error: error.message }, { status: 500 });
  }
}
