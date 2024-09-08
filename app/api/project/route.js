import { connectMongoDB } from "../../../lib/mongodb";
import Projects from "../../../models/projects";
import { NextResponse } from "next/server";

// Function to handle POST request
export async function POST(req) {
    try {
        const { projectname, author, price, permission } = await req.json();
        await connectMongoDB();

        if (permission === false) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        await Projects.create({ projectname, author, price, permission });
        return NextResponse.json({ message: "Project Created" }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}

// Function to handle GET request
export async function GET(req) {
    try {
        await connectMongoDB();

        // Example of a simple permission check
        const allowedToFetch = true; // Replace with your actual permission check logic
        if (!allowedToFetch) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        // Fetch projects with permission: false
        const projectData = await Projects.find({ permission: false });
        return NextResponse.json({ projectData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}
export async function PATCH(req) {
    try {
        const { id, permission } = await req.json();
        await connectMongoDB();

        if (typeof permission !== "boolean") {
            return NextResponse.json({ error: "Invalid permission value" }, { status: 400 });
        }

        const updatedProject = await Projects.findByIdAndUpdate(
            id,
            { permission },
            { new: true }
        );

        if (!updatedProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Permission updated", updatedProject }, { status: 200 });
    } catch (error) {
        console.error("Error updating project permission:", error);
        return NextResponse.json({ error: "Failed to update permission" }, { status: 500 });
    }
}
