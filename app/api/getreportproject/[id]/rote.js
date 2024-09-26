import { connectMongoDB } from "../../../lib/mongodb";
import Reportprojet from "../../../../models/reportprojet";
import { NextResponse } from "next/server";

// GET request to fetch a specific project by ID
export async function GET(req, { params }) {
  const { id } = params;
  await connectMongoDB();
  const post = await Reportprojet.findOne({ _id: id });
  if (!post) {
    return NextResponse.json({ msg: "Project not found" }, { status: 404 });
  }
  return NextResponse.json({ post }, { status: 200 });
}

// PUT request to update a project by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const { newTitle: title, newImg: img, newContent: content } = await req.json();
  await connectMongoDB();
  const updatedPost = await Reportprojet.findByIdAndUpdate(id, { title, img, content }, { new: true });
  
  if (!updatedPost) {
    return NextResponse.json({ msg: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Post updated", updatedPost }, { status: 200 });
}

