import { connectMongoDB } from "../../../lib/mongodb";
import Reportprojet from "../../../models/reportprojet";
import { NextResponse } from "next/server";

// Function to handle POST request
export async function POST(req) {
    try {
        const { name, username, report, more, time } = await req.json();
        await connectMongoDB();
        await Reportprojet.create({ name, username, report, more, time });
        return NextResponse.json({ message: "Project Created" }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}

// Function to handle GET request
export async function GET() {
    try {
        await connectMongoDB();
        const projectData = await Reportprojet.find({});
        console.log("Backend Data:", projectData);
        return NextResponse.json({ projectData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}
