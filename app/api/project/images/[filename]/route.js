import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb'; // ตรวจสอบว่าได้ใช้ ObjectId จาก mongodb

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Connect to MongoDB and get the bucket
    const { imgbucket } = await connectMongoDB();
    
    // Find the file metadata by _id
    const file = await imgbucket.findOne({ _id: new ObjectId(id) });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Open a stream for the file
    const stream = imgbucket.openDownloadStream(file._id);

    return new NextResponse(stream, {
      headers: { "Content-Type": file.contentType },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ msg: "Error fetching image" }, { status: 500 });
  }
}
