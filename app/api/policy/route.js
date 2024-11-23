// File: app/api/policy/route.ts

import { connectMongoDB } from "../../../lib/mongodb";
import { NextResponse } from 'next/server';
import Policy from "../../../models/policy";
export const dynamic = 'force-dynamic';
export async function POST(req) {
  try {
    await connectMongoDB();

    const { policy, type, creator } = await req.json();

    if (!policy || !type) {
      return NextResponse.json({ error: 'Policy content and type are required' }, { status: 400 });
    }

    // Try to find an existing policy with the same type
    let existingPolicy = await Policy.findOne({ type });

    if (existingPolicy) {
      // If policy exists, update it
      existingPolicy.policy = policy;
      existingPolicy.creator = creator;
      existingPolicy.updatedAt = new Date();
      await existingPolicy.save();

      return NextResponse.json({ message: 'Policy updated successfully', id: existingPolicy._id }, { status: 200 });
    } else {
      // If policy doesn't exist, create a new one
      const newPolicy = new Policy({ policy, type, creator });

      await newPolicy.save();

      return NextResponse.json({ message: 'New policy created successfully', id: newPolicy._id }, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving/updating policy:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}