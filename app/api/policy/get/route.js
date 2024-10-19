// File: app/api/getPolicy/route.js

import { connectMongoDB } from "../../../../lib/mongodb";
import Policy from "../../../../models/policy";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json({ error: 'Policy type is required' }, { status: 400 });
    }

    const policy = await Policy.findOne({ type });

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    return NextResponse.json(policy);
  } catch (error) {
    console.error('Error fetching policy:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}