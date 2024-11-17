import { connectMongoDB } from "../../../lib/mongodb";
import { searchterms } from '../../../models/Getsearchterms';
import { NextResponse } from 'next/server';

// เพิ่ม dynamic flag
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const selectedMonth = searchParams.get('month');
    const selectedYear = searchParams.get('year');

    let filter = {};

    if (selectedMonth !== "All" && selectedYear !== "All") {
      const startDate = new Date(Date.UTC(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1));
      const endDate = new Date(Date.UTC(parseInt(selectedYear), parseInt(selectedMonth), 1));
      filter.lastSearched = { 
        $gte: startDate, 
        $lt: endDate 
      };
    }

    const [terms, totalCount] = await Promise.all([
      searchterms.find(filter)
        .sort({ count: -1 })
        .limit(10)
        .lean(),
      searchterms.countDocuments(filter)
    ]);

    return NextResponse.json({
      terms: terms || [],
      count: terms.length,
      totalCount,
      metadata: {
        month: selectedMonth,
        year: selectedYear
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error("Error during fetch:", error);
    return NextResponse.json(
      { error: "Database error", message: error.message },
      { status: 500 }
    );
  }
}