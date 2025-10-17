import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import PortfolioProject from '@/models/PortfolioProject';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';

// GET /api/portfolio - Get all portfolio projects
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const projects = await PortfolioProject.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .lean();

    // Format projects to match expected frontend format
    const formattedProjects = projects.map(project => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      longDescription: project.description, // Add longDescription for compatibility
      technologies: project.techs || project.tags || [],
      category: project.category,
      imageUrl: project.image,
      githubUrl: project.github,
      liveUrl: project.link,
      featured: project.featured,
      order: project.order,
      createdAt: project.createdAt,
    }));

    return successResponse(formattedProjects);
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return errorResponse(error);
  }
}

// POST /api/portfolio - Create a new portfolio project (admin only)
export async function POST(request: NextRequest) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();

    const body = await request.json();
    const { 
      title, 
      description, 
      image, 
      imageUrl,
      tags, 
      technologies,
      link, 
      liveUrl,
      github, 
      githubUrl,
      category, 
      featured, 
      order, 
      techs 
    } = body;

    if (!title || !description) {
      return validationErrorResponse('Title and description are required');
    }

    const newProject = new PortfolioProject({
      title,
      description,
      image: image || imageUrl,
      tags: tags || [],
      link: link || liveUrl,
      github: github || githubUrl,
      category: category || 'Web Development',
      featured: featured || false,
      order: order || 999,
      techs: techs || technologies || [],
    });

    const savedProject = await newProject.save();
    
    return successResponse(
      {
        id: savedProject._id,
        message: 'Portfolio project created successfully',
      },
      201
    );
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return errorResponse(error);
  }
}
