import { connectMongoDB } from "../../../lib/mongodb";
import { searchterms } from '../../../models/Getsearchterms';
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongoDB();
    console.log("MongoDB connection successful");
    
    // Fetch search terms from MongoDB, sort by count in descending order (-1), and limit to 10 results
    const terms = await searchterms.find({})
      .sort({ count: -1 }) // เรียงจากมากไปน้อย
      .limit(10); // จำกัดผลลัพธ์แค่ 10 รายการ
    const count = terms.length; // Get the number of search terms (should be 10 or less)

    console.log("Search terms fetched:", terms);
    console.log("Total search terms count:", count);

    if (count === 0) {
      return new NextResponse(JSON.stringify({ message: 'No search terms found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return both the terms and the total count
    return new NextResponse(JSON.stringify({ count, terms }), {
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