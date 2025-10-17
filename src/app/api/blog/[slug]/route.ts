import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/apiResponse';

// GET /api/blog/[slug] - Get a single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;

    const post = await BlogPost.findOne({ 
      slug: slug,
      status: 'published'
    }).populate('authorId', 'username profilePicture');

    if (!post) {
      return notFoundResponse('Blog post not found');
    }

    const formattedPost = {
      id: post._id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      featuredImage: post.featuredImage,
      author: {
        id: post.authorId._id,
        username: (post.authorId as any).username,
        profilePicture: (post.authorId as any).profilePicture,
      },
      publishedDate: post.createdAt,
      updatedDate: post.updatedAt,
      tags: post.tags,
    };

    return successResponse(formattedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return errorResponse(error);
  }
}

// PUT /api/blog/[slug] - Update a blog post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();
    const { slug: paramSlug } = await params;

    const { title, content, excerpt, featuredImage, slug, status, tags } = await request.json();
    
    // Find by slug OR by _id (to support both slug and id in URL)
    let post = await BlogPost.findOne({ slug: paramSlug });
    if (!post) {
      // Try finding by ID if slug doesn't work
      post = await BlogPost.findById(paramSlug);
    }
    
    if (!post) {
      return notFoundResponse('Blog post not found');
    }

    // Auto-generate excerpt if content changed but excerpt is empty
    let finalExcerpt = excerpt;
    if (content && (!finalExcerpt || !finalExcerpt.trim())) {
      const plainText = content.replace(/[#*_\[\]()~`>]/g, '').trim();
      finalExcerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (finalExcerpt) post.excerpt = finalExcerpt;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (slug) post.slug = slug;
    if (status) post.status = status;
    if (tags) post.tags = tags;

    const updatedPost = await post.save();
    
    return successResponse({
      id: updatedPost._id,
      title: updatedPost.title,
      slug: updatedPost.slug,
      message: 'Blog post updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    
    if (error.code === 11000 && error.keyPattern?.slug) {
      return validationErrorResponse('A post with this slug already exists');
    }
    
    return errorResponse(error);
  }
}

// DELETE /api/blog/[slug] - Delete a blog post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();
    const { slug } = await params;

    const post = await BlogPost.findOneAndDelete({ slug: slug });
    
    if (!post) {
      return notFoundResponse('Blog post not found');
    }
    
    return successResponse({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return errorResponse(error);
  }
}
