// app/api/getreportblog/route.js
import { connectMongoDB } from "../../../lib/mongodb";
import blog from "../../../models/postblog";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
      const { name, username, report, more, time } = await req.json();
      await connectMongoDB();
      await blog.create({ name, username, report, more, time });
      return NextResponse.json({ message: "Blog Created" }, { status: 201 });
    } catch (error) {
      console.error("Error creating blog:", error);
      return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
  }
export async function GET() {
  await connectMongoDB();
  const blogData = await blog.find({});
  console.log("Backend Data:", blogData); // Log the data to check its structure
  return NextResponse.json({ blogData }, { status: 200 }); // Ensure the structure matches the frontend expectation
}

