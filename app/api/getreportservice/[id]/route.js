import { connectMongoDB } from "../../../../lib/mongodb";
import PostSer from "../../../../models/postservice";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = params;
    await connectMongoDB();
    const post = await PostSer.findOne({ _id: id });
    return NextResponse.json({ post }, { status: 200 });
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { newTitle: title, newImg: img, newContent: content } = await req.json();
    await connectMongoDB();
    await PostSer.findByIdAndUpdate(id, { title, img, content });
    return NextResponse.json({ message: "Post updated" }, { status: 200 });
}