import { connectMongoDB } from "../../../../lib/mongodb";
import blog from "../../../../models/postblog";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    await connectMongoDB();

    const post = await blog.findOne({ _id: id });
    const blogData = await blog.findById(id);

    if (!blogData) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post,blogData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { newTitle: title, newImg: img, newContent: content } = await req.json();

    await connectMongoDB();

    const updatedPost = await blog.findByIdAndUpdate(
      id,
      { title, img, content },
      { new: true } // This option returns the updated document
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post updated", updatedPost }, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
