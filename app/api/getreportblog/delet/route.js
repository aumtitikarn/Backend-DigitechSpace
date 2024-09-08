import { connectMongoDB } from "../../../../lib/mongodb";
import PostBlog from "../../../../models/postblog";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { id } = await req.json(); // Assume the id of the report is sent in the request body

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
