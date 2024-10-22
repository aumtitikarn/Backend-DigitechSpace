import { connectMongoDB } from "../../../lib/mongodb";
import { searchterms } from '../../../models/Getsearchterms'; // Import your search terms model
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectMongoDB();
    console.log("MongoDB connection successful");

    const url = new URL(req.url);
    const selectedMonth = url.searchParams.get('month');
    const selectedYear = url.searchParams.get('year');

    let filter = {};

    if (selectedMonth !== "All" && selectedYear !== "All") {
      const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
      const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 1));
      filter.lastSearched = { $gte: startDate, $lt: endDate };
    }

    const terms = await searchterms.find(filter)
      .sort({ count: -1 })
      .limit(10);
    const count = terms.length;

    if (count === 0) {
      return new NextResponse(JSON.stringify({ terms: [], count: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify({ terms, count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error during fetch:", error);
    return new NextResponse(JSON.stringify({ message: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// export async function GET(req) {
//   try {
//     await connectMongoDB();
//     console.log("MongoDB connection successful");

//     // รับค่า selectedMonth และ selectedYear จาก query string
//     const url = new URL(req.url);
//     const selectedMonth = url.searchParams.get('month');
//     const selectedYear = url.searchParams.get('year');

//     // สร้าง filter สำหรับการกรองตาม addedAt
//     let filter = {};

//     // ถ้าเดือนและปีไม่ใช่ 'All' ทำการกรองข้อมูลตามวันที่
//     if (selectedMonth !== 'All' && selectedYear !== 'All') {
//       const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1)); // เริ่มต้นวันที่ 1 ของเดือนที่เลือก
//       const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 1)); // สิ้นสุดวันที่ 1 ของเดือนถัดไป

//       // เพิ่ม filter สำหรับการกรองตามวันที่
//       filter.addedAt = { $gte: startDate, $lt: endDate };
//     }

//     // ดึงข้อมูลจาก searchterms ตาม filter ที่สร้าง
//     const terms = await searchterms.find(filter)
//       .sort({ count: -1 }) // เรียงจากมากไปน้อย
//       .limit(10); // จำกัดผลลัพธ์แค่ 10 รายการ

//     const count = terms.length; // Get the number of search terms (should be 10 or less)

//     console.log("Search terms fetched:", terms);
//     console.log("Total search terms count:", count);

//     if (count === 0) {
//       return new NextResponse(JSON.stringify({ message: 'No search terms found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Return both the terms and the total count
//     return new NextResponse(JSON.stringify({ count, terms }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error("Error during fetch:", error);
//     return new NextResponse(JSON.stringify({ message: 'Server Error' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }