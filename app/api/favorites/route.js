import { connectMongoDB } from '../../../../lib/mongodb'; // MongoDB connection function
import Favorites from '../../../../models/favorites'; // ตรวจสอบว่าเป็น Favorites model ที่ถูกต้อง
import { NextResponse } from 'next/server'; // Import NextResponse


// GET handler to fetch favorites
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email'); // Get the email from query params

    if (!email) {
      return new NextResponse(JSON.stringify({ error: "Missing required query parameter: email" }), { status: 400 });
    }

    // Find the user's favorites by email
    const favoriteProjects = await Favorites.findOne({ email }, 'projectId').exec(); 

    if (!favoriteProjects) {
      return new NextResponse(JSON.stringify([]), { status: 200 }); // Return empty array if no favorites found
    }

    // Send back the array of projectIds
    return new NextResponse(JSON.stringify(favoriteProjects.projectId), { status: 200 });
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch favorites' }), { status: 500 });
  }
}

