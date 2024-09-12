import { connectMongoDB } from "../../../lib/mongodb";
import Projects from "../../../models/projects";
import { NextResponse } from "next/server";

// POST - Create a new project
export async function POST(req) {
    try {
        const { projectname, author, price, permission, imageUrl } = await req.json();
        await connectMongoDB();

        // If permission is false, return a 403 error
        if (permission === false) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        const status = "Submitted"; // Default status
        const newProject = new Projects({ projectname, author, price, permission, imageUrl, status });
        await newProject.save();

        return NextResponse.json({ message: "Project Created", project: newProject }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}




export async function GET(req) {
    try {
        await connectMongoDB();

        const allowedToFetch = true; // Replace with actual permission logic
        if (!allowedToFetch) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        const projectData = await Projects.find({ permission: false });
        return NextResponse.json({ projectData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}


