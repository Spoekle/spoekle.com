import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Game from '@/models/Games';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';

// GET /api/games - Get all games
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    let query: any = {};
    
    if (!includeInactive) {
      query.active = true;
    }

    const games = await Game.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return successResponse(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return errorResponse(error);
  }
}

// POST /api/games - Create a new game (admin only)
export async function POST(request: NextRequest) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();

    const body = await request.json();
    const { id, name, shortDescription, image, icon, color, about, review, downloads, images, order, active } = body;

    // Validate required fields
    if (!id || !name || !shortDescription || !image || !icon || !color || !about || about.length === 0) {
      return validationErrorResponse('id, name, shortDescription, image, icon, color, and at least one about paragraph are required');
    }

    // Check if game ID already exists
    const existingGame = await Game.findOne({ id });
    if (existingGame) {
      return validationErrorResponse('A game with this ID already exists');
    }

    const newGame = new Game({
      id,
      name,
      shortDescription,
      image,
      icon,
      color,
      about,
      review: review || '',
      downloads: downloads || [],
      images: images || [],
      order: order !== undefined ? order : 0,
      active: active !== undefined ? active : true,
    });

    const savedGame = await newGame.save();
    
    return successResponse(
      {
        id: savedGame._id,
        message: 'Game created successfully',
      },
      201
    );
  } catch (error) {
    console.error('Error creating game:', error);
    return errorResponse(error);
  }
}
