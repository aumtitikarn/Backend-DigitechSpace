import { connectMongoDB } from "../../../../lib/mongodb";
import blog from "../../../../models/postblog";
import Post from "../../../../models/posts";
import Notification from "../../../..//models/notification";
import { NextResponse } from "next/server";
import mongoose, { ObjectId } from 'mongoose';

export async function GET(req, { params }) {
  const { id } = params;

  console.log("Received id:", id);

  // Check if the ID is valid
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.error('Invalid ID:', id);
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  try {
    await connectMongoDB();

    const allPosts = await blog.find({});
    console.log("All posts:", allPosts);
    //  const post = await db.collection('postblog').findOne({ _id: new ObjectId(id) });
    const post = await blog.findOne({ _id: new mongoose.Types.ObjectId(id) });

    console.log("get id backend :",id)
    console.log("get post backend :",post)
    
    if (!post) {
      console.log(`Post not found for ID: ${id}`);
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ message: 'Error fetching post' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { newTitle: title, newImg: img, newContent: content } = await req.json();

    await connectMongoDB();

    const updatedPost = await PostBlog.findByIdAndUpdate(
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

    // Notify the owner of the blog
    const notificationMessage = `Your blog titled "${blogData.blogname}" has been deleted.`;
    
    // Check if a notification record exists for this email
    const notification = await Notification.findOne({ email: blogData.blogEmail });

    if (notification) {
      // Add the new message to the existing notifications array
      notification.notifications.push(notificationMessage);
      await notification.save();
    } else {
      // If no notification record exists, create a new one
      const newNotification = new Notification({
        email: blogData.blogEmail,
        notifications: [notificationMessage],
      });
      await newNotification.save();
    }

    return NextResponse.json({ message: "Post and blog deleted, and notification sent" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post or sending notification:", error);
    return NextResponse.json({ error: "Failed to delete post and send notification" }, { status: 500 });
  }
}