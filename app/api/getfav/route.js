import { connectMongoDB } from "../../../lib/mongodb";
import { favorites } from '../../../models/Getfav'; // แก้ไขการนำเข้าที่ถูกต้อง
import { projects } from '../../../models/Getproject';

export async function GET(req) {
  try {
    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    // ดึงข้อมูลทั้งหมดจาก favorites
    const favoriteData = await favorites.find(); // ตรวจสอบว่า favorites ถูกต้อง

    // รวม projectId ทั้งหมดจาก favorites
    const allProjectIds = favoriteData.flatMap(favorite => favorite.projectId);

    // ค้นหาโปรเจคที่ตรงกับ projectId เหล่านี้
    const matchedProjects = await projects.find({ _id: { $in: allProjectIds } });

    // ดึงชื่อโปรเจค
    const projectNames = matchedProjects.map(project => project.projectname);

    // นับจำนวนโปรเจคที่ตรงกัน
    const projectCounts = projectNames.reduce((countMap, projectName) => {
      countMap[projectName] = (countMap[projectName] || 0) + 1;
      return countMap;
    }, {});

    // ส่งข้อมูลกลับเป็น JSON
    return new Response(JSON.stringify({
      projectNames: Object.keys(projectCounts),
      projectCounts: Object.values(projectCounts),
    }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
