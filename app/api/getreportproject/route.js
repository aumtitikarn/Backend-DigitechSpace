import { connectMongoDB } from "../../../lib/mongodb";
import Reportprojet from "../../../models/reportprojet";
import { NextResponse } from "next/server";

// Function to handle POST request
export async function POST(req) {
    try {
        const { name, username, report, more, time } = await req.json();
        await connectMongoDB();
        await Reportprojet.create({ name, username, report, more, time });
        return NextResponse.json({ message: "Project Created" }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
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
export async function DELETE(req, { params }) {
    try {
        await connectMongoDB();
  
        const { projectId } = await req.json(); // รับ projectId จาก body ของ request
        console.log("Deleting project with projectId:", projectId); // แสดง projectId ที่จะลบ

        const deletedPost = await Reportprojet.findOneAndDelete({ projectId }); // ค้นหาและลบโดยใช้ projectId

        if (!deletedPost) {
            console.error("Project not found for projectId:", projectId); // ล็อกถ้าไม่พบ project
            return NextResponse.json({ msg: "Project not found" }, { status: 404 });
        }

        console.log("Project deleted successfully:", deletedPost); // ล็อกเมื่อมีการลบสำเร็จ
        return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in DELETE handler:", error); // ล็อกข้อผิดพลาด
        return NextResponse.json({ msg: "Error deleting project" }, { status: 500 });
    }
}