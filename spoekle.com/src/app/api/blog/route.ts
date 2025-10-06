import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/apiResponse';

// GET /api/blog - Get all blog posts with pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    let query: any = { status: 'published' };

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const total = await BlogPost.countDocuments(query);

    const posts = await BlogPost.find(query)
      .populate('authorId', 'username profilePicture')
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedPosts = posts.map(post => {
      const author = post.authorId as any;
      return {
        id: post._id,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        featuredImage: post.featuredImage,
        author: {
          id: author?._id || author,
          username: author?.username || 'Unknown',
          profilePicture: author?.profilePicture,
        },
        publishedDate: post.publishedDate,
        tags: post.tags,
      };
    });

    return successResponse({
      posts: formattedPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return errorResponse(error);
  }
}

// POST /api/blog - Create a new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const currentUser = requireAuth(request);
    requireAdmin(currentUser);

    await dbConnect();

    const { title, content, excerpt, featuredImage, slug, status, tags } = await request.json();

    if (!title || !content) {
      return validationErrorResponse('Title and content are required');
    }

    // Auto-generate excerpt if not provided
    let finalExcerpt = excerpt;
    if (!finalExcerpt || !finalExcerpt.trim()) {
      // Strip markdown and limit to 150 chars
      const plainText = content.replace(/[#*_\[\]()~`>]/g, '').trim();
      finalExcerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    }

    // Auto-generate slug if not provided
    let finalSlug = slug;
    if (!finalSlug || !finalSlug.trim()) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    const newPost = new BlogPost({
      title,
      content,
      excerpt: finalExcerpt,
      featuredImage,
      slug: finalSlug,
      authorId: currentUser.id,
      status: status || 'published',
      tags: tags || [],
    });

    const savedPost = await newPost.save();

    return successResponse(
      {
        id: savedPost._id,
        title: savedPost.title,
        slug: savedPost.slug,
        message: 'Blog post created successfully',
      },
      201
    );
  } catch (error: any) {
    console.error('Error creating blog post:', error);

    if (error.code === 11000 && error.keyPattern?.slug) {
      return validationErrorResponse('A post with this slug already exists');
    }

    return errorResponse(error);
  }
}
