import { connectMongoDB } from "../../../lib/mongodb";
import { searchterms } from '../../../models/Getsearchterms';
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongoDB();
    console.log("MongoDB connection successful");
    
    // Fetch search terms from MongoDB and sort by lastSearched in descending order (-1)
    const terms = await searchterms.find({}).sort({ lastSearched: -1 });
    const count = terms.length;  // Get the number of search terms

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