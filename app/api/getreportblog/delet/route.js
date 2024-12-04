import { connectMongoDB } from "../../../../lib/mongodb";
import PostBlog from "../../../../models/postblog";
import Post from "../../../../models/posts";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { id } = await req.json(); // Assume the id of the report is sent in the request body

    // console.log("id :",id)

    // const blogdata = await PostBlog.findById({ _id: id });

    // console.log("blogdata :",blogdata.blogid)

    // const idblog = (blogdata.blogid);

    // console.log("idblog :",idblog)

    // const { client, imgbucket, filebucket } = await connectMongoDB();

    // if (!id) {
    //   return NextResponse.json({ msg: "Missing blogid" }, { status: 400 });
    // }

    // const objectId = new ObjectId(idblog);

    // console.log("objectId :",objectId)

    // const blog = await Post.findOne({ _id: objectId });

    // console.log("blog :",blog)

    // if (!blog) {
    //   return NextResponse.json({ message: "blog not found" }, { status: 404 });
    // }

    // // Deleting images from images bucket
    // if (blog.imageUrl && blog.imageUrl.length > 0) {
    //   for (const imageName of blog.imageUrl) {
    //     const image = await imgbucket.find({ filename: imageName }).toArray();
    //     if (image.length > 0) {
    //       const imageId = image[0]._id;
    //       await imgbucket.delete(imageId);
    //       await client.collection("images.chunks").deleteMany({ files_id: imageId });
    //     }
    //   }
    // }

    if (!id) {
      return NextResponse.json({ msg: "ID is required" }, { status: 400 });
    }

    const deletedReport = await PostBlog.findByIdAndDelete(id);

    if (!deletedReport) {
      return NextResponse.json({ msg: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { msg: "Error deleting report" },
      { status: 500 }
    );
  }
}
