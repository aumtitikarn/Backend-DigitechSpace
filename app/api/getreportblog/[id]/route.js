import { connectMongoDB } from "../../../../lib/mongodb";
import blog from "../../../../models/postblog";
import Post from "../../../../models/posts";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  const { id } = params;

  console.log("Received id:", id);

  // Check if the ID is valid
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.error('Invalid ID:', id);
    return new Response('Invalid ID', { status: 400 });
  }

  try {
    await connectMongoDB();
    const post = await blog.findById(id);
    if (!post) {
      console.error('Post not found:', id);
      return new Response('Post not found', { status: 404 });
    }
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response('Error fetching post', { status: 500 });
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

export async function DELETE(req, { params }) {
  try {
    const { id } = params; // ใช้ id ของ postblogs เพื่อค้นหา blogid
    await connectMongoDB();

    // ค้นหา blogid จากคอลเลกชัน postblogs
    const blogData = await blog.findById(id);
    
    if (!blogData) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // ค้นหาและลบโพสต์จากคอลเลกชัน posts โดยใช้ blogid
    const deletedPost = await Post.findByIdAndDelete(blogData.blogid);
    
    if (!deletedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post and blog deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}