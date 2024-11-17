import { connectMongoDB } from '../../../lib/mongodb';
import Favorites from '../../../models/favorites';
import { NextResponse } from 'next/server';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

// Utility functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidProjectId = (id) => {
  return typeof id === 'string' && id.length > 0;
};

export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email parameter" },
        { status: 400 }
      );
    }

    // Find the user's favorites
    const favoriteProjects = await Favorites.findOne({ email }, 'projectId').lean();

    // Return empty array if no favorites found
    if (!favoriteProjects) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }

    // Return the projectIds array
    return NextResponse.json(favoriteProjects.projectId, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();

    const body = await request.json();
    const { email, projectId } = body;

    if (!email || !isValidEmail(email) || !isValidProjectId(projectId)) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    let favorites = await Favorites.findOne({ email });
    let isFavorited = false;

    if (!favorites) {
      // Create new favorites document if none exists
      favorites = await Favorites.create({
        email,
        projectId: [projectId]
      });
      isFavorited = true;
    } else {
      // Toggle favorite status
      const exists = favorites.projectId.includes(projectId);
      if (exists) {
        // Remove projectId if it exists
        favorites.projectId = favorites.projectId.filter(id => id !== projectId);
        isFavorited = false;
      } else {
        // Add projectId if it doesn't exist
        favorites.projectId.push(projectId);
        isFavorited = true;
      }
      await favorites.save();
    }

    return NextResponse.json(
      { 
        message: isFavorited ? "Added to favorites" : "Removed from favorites",
        isFavorited 
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );

  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json(
      { error: 'Failed to update favorites' },
      { status: 500 }
    );
  }
}