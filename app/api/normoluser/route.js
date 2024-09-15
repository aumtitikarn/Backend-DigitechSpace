import { connectMongoDB } from "../../../lib/mongodb";
import Normalusers from "../../../models/normalusers"
import { NextResponse } from "next/server";

export async function POST(req) {
    const { name, email } = await req.json();
    console.log(name, email);
    await connectMongoDB();
    await Normalusers.create({ name, email });
    return NextResponse.json({ message: "Normalusers Test" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const normalusers = await Normalusers.find({});
    return NextResponse.json({ normalusers });
}

