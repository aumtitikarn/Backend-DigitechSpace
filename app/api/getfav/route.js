import { connectMongoDB } from "../../../lib/mongodb";
import { favorites } from '../../../models/Getfav'; 
import { projects } from '../../../models/Getproject';

export async function GET(req) {
  try {
    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    // รับค่า selectedMonth และ selectedYear จาก query string
    const url = new URL(req.url);
    const selectedMonth = url.searchParams.get('month');
    const selectedYear = url.searchParams.get('year');

    // สร้าง filter สำหรับการกรองตาม addedAt
    let filter = {};

    // กรองข้อมูลตามเดือนและปี ถ้าเลือกเดือนและปีที่เฉพาะเจาะจง
    if (selectedMonth !== 'All' && selectedYear !== 'All') {
      const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1)); // วันที่เริ่มต้น
      const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 1)); // วันที่สิ้นสุด
      filter.addedAt = { $gte: startDate, $lt: endDate };
    }

    // ดึงข้อมูลจาก favorites ตาม filter
    const favoriteData = await favorites.find(filter);

    // ตรวจสอบว่ามีข้อมูล favorite หรือไม่
    if (!favoriteData.length) {
      return new Response(JSON.stringify({
        projectNames: [],
        projectCounts: [],
      }), { status: 200 });
    }

    // รวม projectId ทั้งหมดจาก favorites
    const allProjectIds = favoriteData.flatMap(favorite => favorite.projectId);

    // ค้นหาโปรเจคที่ตรงกับ projectId เหล่านี้
    const matchedProjects = await projects.find({ _id: { $in: allProjectIds } });

    // ตรวจสอบว่ามีข้อมูลโปรเจคหรือไม่
    if (!matchedProjects.length) {
      return new Response(JSON.stringify({
        projectNames: [],
        projectCounts: [],
      }), { status: 200 });
    }

    // ดึงชื่อโปรเจค
    const projectNames = matchedProjects.map(project => project.projectname);

    // นับจำนวนโปรเจคที่ตรงกัน
    const projectCountsMap = projectNames.reduce((countMap, projectName) => {
      countMap[projectName] = (countMap[projectName] || 0) + 1;
      return countMap;
    }, {});

    // สร้าง array สำหรับ projectNames และ projectCounts
    const projectNamesArray = Object.keys(projectCountsMap);
    const projectCountsArray = Object.values(projectCountsMap);

    // ตรวจสอบข้อมูลที่ถูกดึงมา
    console.log('Favorite Data:', favoriteData);
    console.log('All Project IDs:', allProjectIds);
    console.log('Matched Projects:', matchedProjects);
    console.log('Project Names Array:', projectNamesArray);
    console.log('Project Counts Array:', projectCountsArray);

    // ส่งข้อมูลกลับเป็น JSON
    return new Response(JSON.stringify({
      projectNames: projectNamesArray,
      projectCounts: projectCountsArray,
    }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}