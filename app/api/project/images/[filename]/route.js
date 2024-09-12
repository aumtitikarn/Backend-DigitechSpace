import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';

export async function GET(req, { params }) {
  const { filename } = params;

  try {
    // Connect to MongoDB and get the bucket
    const { imgbucket } = await connectMongoDB();
    
    // Find the file metadata
    const file = await imgbucket.findOne({ filename });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Open a stream for the file
    const stream = imgbucket.openDownloadStreamByName(filename);

    return new NextResponse(stream, {
      headers: { "Content-Type": file.contentType },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ msg: "Error fetching image" }, { status: 500 });
  }
}
