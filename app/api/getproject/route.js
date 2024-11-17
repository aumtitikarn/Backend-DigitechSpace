import { connectMongoDB } from "../../../lib/mongodb";
import Project from "../../../models/project";
import { NextResponse } from "next/server";
import StudentUser from "../../../models/studentusers";

// Utility functions
const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const getProxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

// เพิ่มการกำหนดค่า config สำหรับ dynamic route
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectMongoDB();

    // ใช้ searchParams จาก Request object แทน
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query = {
      ...(category && category !== "All" && { category }),
      permission: true
    };

    console.log('Fetching projects with query:', query);

    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();

    const populatedProjects = await Promise.all(projects.map(async (project) => {
      let user = await StudentUser.findOne({ email: project.email }, 'name imageUrl').lean();
      
      let profileImageSource = null;
      if (user && user.imageUrl) {
        if (isValidHttpUrl(user.imageUrl)) {
          profileImageSource = getProxyUrl(user.imageUrl);
        } else {
          profileImageSource = `/api/project/images/${user.imageUrl}`;
        }
      }

      return {
        ...project,
        authorName: user ? user.name : 'Unknown Author',
        profileImage: profileImageSource
      };
    }));

    return NextResponse.json(populatedProjects, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}