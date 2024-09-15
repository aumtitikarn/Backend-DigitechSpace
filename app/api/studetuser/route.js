import { connectMongoDB } from "../../../lib/mongodb";
import Studentusers from "../../../models/studentusers"
import { NextResponse } from "next/server";

export async function POST(req) {
    const { name, email } = await req.json();
    console.log(name, email);
    await connectMongoDB();
    await Studentusers.create({ name, email });
    return NextResponse.json({ message: "Studentusers Test" }, { status: 201 });
}
 
export async function GET() {
    await connectMongoDB();
    const studentusers = await Studentusers.find({});
    return NextResponse.json({ studentusers });
}

