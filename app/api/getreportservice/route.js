import { connectMongoDB } from "../../../lib/mongodb";
import PostSer from "../../../models/postservice"
import { NextResponse } from "next/server";

export async function POST(req) {
    const { report, email,username } = await req.json();
    console.log(report, email,username);
    await connectMongoDB();
    await PostSer.create({ report, email ,username});
    return NextResponse.json({ message: "PostService Test" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const postservice = await PostSer.find({});
    return NextResponse.json({ postservice });
}
