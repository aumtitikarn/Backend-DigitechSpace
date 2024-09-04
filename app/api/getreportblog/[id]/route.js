import { connectMongoDB } from "../../../lib/mongodb";
import blog from "../../../models/postblog";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    const { id } = params;
    await connectMongoDB();
    const post = await blog.findOne({ _id: id });
    return NextResponse.json({ post }, { status: 200 });
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { newTitle: title, newImg: img, newContent: content } = await req.json();
    await connectMongoDB();
    await blog.findByIdAndUpdate(id, { title, img, content });
    return NextResponse.json({ message: "Post updated" }, { status: 200 });
}