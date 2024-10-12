import { connectMongoDB } from "../../../lib/mongodb";
import Projects from "../../../models/projects";
import { NextResponse } from "next/server";
import Studentusers from "../../../models/studentusers";

// ฟังก์ชันตรวจสอบ URL รูปภาพว่าเป็นลิงก์ภายนอกหรือไม่
const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

// ฟังก์ชันสร้าง Proxy URL สำหรับลิงก์ภายนอก
const useProxy = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

// POST - Create a new project
export async function POST(req) {
  try {
    const { projectname, email, price, permission, imageUrl } = await req.json();
    await connectMongoDB();

    // ถ้าผู้ใช้ไม่มี permission จะคืนค่าเป็น 403
    if (permission === false) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const status = "Submitted"; // กำหนดสถานะเริ่มต้นเป็น Submitted
    const newProject = new Projects({ projectname, email, price, permission, imageUrl, status });
    await newProject.save();

    return NextResponse.json({ message: "Project Created", project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

// GET - ดึงข้อมูลโปรเจกต์ที่ permission = false พร้อมข้อมูลผู้เขียน
export async function GET(req) {
  try {
    await connectMongoDB();

    const allowedToFetch = true; // Replace with actual permission logic
    if (!allowedToFetch) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // ดึงข้อมูลโปรเจกต์ที่ permission = false
    const projectData = await Projects.find({ permission: false }).lean();

    // สร้างอาร์เรย์ใหม่ที่เก็บข้อมูลโปรเจกต์พร้อมข้อมูลผู้เขียน
    const projectsWithAuthorDetails = await Promise.all(
      projectData.map(async (project) => {
        // ดึงข้อมูลผู้เขียนจาก Studentusers
        const author = await Studentusers.findOne({ email: project.email }, 'name imageUrl').lean();

        let authorName = 'Unknown Author'; // ค่าเริ่มต้นของชื่อผู้เขียน
        let profileImage = null; // ค่าเริ่มต้นของรูปโปรไฟล์

        if (author) {
          authorName = author.name;
          if (author.imageUrl) {
            // ตรวจสอบว่า URL ของรูปโปรไฟล์เป็นลิงก์ภายนอกหรือไม่
            profileImage = isValidHttpUrl(author.imageUrl)
              ? useProxy(author.imageUrl)
              : `/api/project/images/${author.imageUrl}`;
          }
        }

        // คืนค่าข้อมูลโปรเจกต์พร้อมข้อมูลผู้เขียน
        return {
          ...project,
          authorName,
          profileImage
        };
      })
    );

    // ส่งข้อมูลโปรเจกต์พร้อมรายละเอียดผู้เขียนกลับ
    return NextResponse.json({ projectData: projectsWithAuthorDetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
