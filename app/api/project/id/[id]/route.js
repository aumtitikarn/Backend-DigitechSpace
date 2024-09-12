import { connectMongoDB } from "../../../../../lib/mongodb";
import Projects from "../../../../../models/projects";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Handle GET method for fetching the project by ID
export async function GET(req) {
  try {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    await connectMongoDB();
    const project = await Projects.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// Handle PATCH method for updating the project by ID
export async function PATCH(req) {
  try {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const { permission, status, rejecttext } = await req.json();
    await connectMongoDB();

    let updateFields = {};

    if (permission !== undefined) {
      updateFields.permission = permission;
    }

    if (status !== undefined) {
      updateFields.status = status;
    }

    if (rejecttext) {
      updateFields.rejecttext = rejecttext;
    }

    const updatedProject = await Projects.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project updated", updatedProject }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
