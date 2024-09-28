import { connectMongoDB } from "../../../../lib/mongodb";
import PostSer from "../../../../models/postservice"
import { NextResponse } from "next/server";

export async function DELETE(req) {
    const { id } = await req.json(); // รับ id จาก request body
    console.log(`Deleting report with ID: ${id}`);

    await connectMongoDB();
    const deletedReport = await PostSer.findByIdAndDelete(id); // ลบรายงานโดยใช้ id

    if (!deletedReport) {
        return NextResponse.json({ message: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report deleted successfully" }, { status: 200 });
}