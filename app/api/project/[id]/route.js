import { connectMongoDB } from "../../../../lib/mongodb";
import Projects from "../../../../models/projects";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params; // Use params to get the dynamic route parameter
    const { permission } = await req.json();
    await connectMongoDB();

    const result = await Projects.findByIdAndUpdate(id, { permission }, { new: true });

    if (!result) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
