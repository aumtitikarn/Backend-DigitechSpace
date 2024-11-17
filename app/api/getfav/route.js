import { connectMongoDB } from "../../../lib/mongodb";
import { favorites } from '../../../models/Getfav';
import { projects } from '../../../models/Getproject';
import { NextResponse } from 'next/server';

// กำหนดให้เป็น dynamic route
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectMongoDB();

    // ใช้ searchParams จาก request
    const { searchParams } = new URL(request.url);
    const selectedMonth = searchParams.get('month');
    const selectedYear = searchParams.get('year');

    // ตรวจสอบความถูกต้องของ input
    if (!selectedMonth || !selectedYear) {
      return NextResponse.json({
        projectNames: [],
        projectCounts: [],
        error: "Missing month or year parameter"
      }, { status: 400 });
    }

    // สร้าง date filter
    let dateFilter = {};
    if (selectedMonth !== 'All' && selectedYear !== 'All') {
      const startDate = new Date(Date.UTC(
        parseInt(selectedYear),
        parseInt(selectedMonth) - 1,
        1
      ));
      const endDate = new Date(Date.UTC(
        parseInt(selectedYear),
        parseInt(selectedMonth),
        1
      ));
      dateFilter = {
        addedAt: {
          $gte: startDate,
          $lt: endDate
        }
      };
    }

    // ดึงข้อมูล favorites
    const favoriteData = await favorites.find(dateFilter).lean();

    if (!favoriteData.length) {
      return NextResponse.json({
        projectNames: [],
        projectCounts: [],
        metadata: { month: selectedMonth, year: selectedYear }
      }, {
        status: 200,
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    // รวบรวม projectIds
    const allProjectIds = favoriteData.flatMap(favorite => favorite.projectId);

    // ดึงข้อมูล projects
    const matchedProjects = await projects.find({
      _id: { $in: allProjectIds }
    }).lean();

    if (!matchedProjects.length) {
      return NextResponse.json({
        projectNames: [],
        projectCounts: [],
        metadata: { month: selectedMonth, year: selectedYear }
      }, {
        status: 200,
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    // สร้าง project statistics
    const projectStats = matchedProjects.reduce((stats, project) => {
      const name = project.projectname;
      stats[name] = (stats[name] || 0) + 1;
      return stats;
    }, {});

    // แปลงเป็น arrays
    const projectNames = Object.keys(projectStats);
    const projectCounts = Object.values(projectStats);

    // ส่งผลลัพธ์
    return NextResponse.json({
      projectNames,
      projectCounts,
      metadata: {
        month: selectedMonth,
        year: selectedYear,
        totalFavorites: favoriteData.length,
        uniqueProjects: projectNames.length
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error in getFavorites:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: error.message
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}

// Utility functions (อาจแยกไปไฟล์ต่างหาก)
const isValidDate = (month, year) => {
  if (month === "All" || year === "All") return true;
  
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  
  return (
    !isNaN(monthNum) &&
    !isNaN(yearNum) &&
    monthNum >= 1 &&
    monthNum <= 12 &&
    yearNum >= 2000 &&
    yearNum <= new Date().getFullYear()
  );
};