import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import PortfolioProject from '@/models/PortfolioProject';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/apiResponse';

// GET /api/portfolio/[id] - Get a single portfolio project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const project = await PortfolioProject.findById(id).lean();

    if (!project) {
      return notFoundResponse('Portfolio project not found');
    }

    // Format project to match expected frontend format
    const formattedProject = {
      _id: project._id,
      title: project.title,
      description: project.description,
      longDescription: project.description,
      technologies: project.techs || project.tags || [],
      category: project.category,
      imageUrl: project.image,
      githubUrl: project.github,
      liveUrl: project.link,
      featured: project.featured,
      order: project.order,
      createdAt: project.createdAt,
    };

    return successResponse(formattedProject);
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
    return errorResponse(error);
  }
}

// PUT /api/portfolio/[id] - Update a portfolio project (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();
    const { id } = await params;

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

    const updateData: any = {
      title,
      description,
      image: image || imageUrl,
      tags: tags || [],
      link: link || liveUrl,
      github: github || githubUrl,
      category: category || 'Web Development',
      featured: featured !== undefined ? featured : false,
      order: order !== undefined ? order : 999,
      techs: techs || technologies || [],
    };
    
    const project = await PortfolioProject.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return notFoundResponse('Portfolio project not found');
    }
    
    return successResponse({
      id: project._id,
      message: 'Portfolio project updated successfully',
    });
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    return errorResponse(error);
  }
}

// DELETE /api/portfolio/[id] - Delete a portfolio project (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();
    const { id } = await params;

    const project = await PortfolioProject.findByIdAndDelete(id);
    
    if (!project) {
      return notFoundResponse('Portfolio project not found');
    }
    
    return successResponse({ message: 'Portfolio project deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    return errorResponse(error);
  }
}
