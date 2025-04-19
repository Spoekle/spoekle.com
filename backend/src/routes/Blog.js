// filepath: /data/compose/spoekle.com/backend/src/routes/Blog.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPostModel');
const User = require('../models/userModel');
const verifyToken = require('./middleware/VerifyToken');
const authorizeRoles = require('./middleware/AuthorizeRoles');

/**
 * @swagger
 * /blog:
 *   get:
 *     tags:
 *       - Blog
 *     summary: Get all blog posts
 *     description: Retrieves a list of all published blog posts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter posts by tag
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter posts
 *     responses:
 *       200:
 *         description: A list of blog posts
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const tag = req.query.tag;
    const search = req.query.search;

    let query = { status: 'published' };

    // Add tag filter if provided
    if (tag) {
      query.tags = tag;
    }

    // Add text search if provided
    if (search) {
      query.$text = { $search: search };
    }

    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);
    
    // Get posts with pagination
    const posts = await BlogPost.find(query)
      .populate('authorId', 'username profilePicture')
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(limit);

    // Format posts for response
    const formattedPosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      featuredImage: post.featuredImage,
      author: {
        id: post.authorId._id,
        username: post.authorId.username,
        profilePicture: post.authorId.profilePicture
      },
      publishedDate: post.publishedDate,
      tags: post.tags,
    }));

    res.status(200).json({
      posts: formattedPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
});

/**
 * @swagger
 * /blog/{slug}:
 *   get:
 *     tags:
 *       - Blog
 *     summary: Get a blog post by slug
 *     description: Retrieves a single blog post by its slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the blog post
 *     responses:
 *       200:
 *         description: The blog post
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      status: 'published'
    }).populate('authorId', 'username profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
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
        username: post.authorId.username,
        profilePicture: post.authorId.profilePicture
      },
      publishedDate: post.publishedDate,
      tags: post.tags,
    };

    res.status(200).json(formattedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Error fetching blog post' });
  }
});

/**
 * @swagger
 * /blog:
 *   post:
 *     tags:
 *       - Blog
 *     summary: Create a new blog post
 *     description: Creates a new blog post (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *               slug:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User does not have admin role
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, slug, status, tags } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Create a shortened excerpt if not provided
    const finalExcerpt = excerpt || content.substring(0, 150) + '...';

    // Create new blog post
    const newPost = new BlogPost({
      title,
      content,
      excerpt: finalExcerpt,
      featuredImage,
      slug: slug || undefined, // Let the schema middleware generate if not provided
      authorId: req.user.id,
      status: status || 'published',
      tags: tags || []
    });

    const savedPost = await newPost.save();
    
    res.status(201).json({
      id: savedPost._id,
      title: savedPost.title,
      slug: savedPost.slug,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      return res.status(400).json({ message: 'A post with this slug already exists' });
    }
    res.status(500).json({ message: 'Error creating blog post' });
  }
});

router.put('/:id', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, slug, status, tags } = req.body;
    
    // Find the post to update
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Update the post fields if provided
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (slug) post.slug = slug;
    if (status) post.status = status;
    if (tags) post.tags = tags;

    const updatedPost = await post.save();
    
    res.status(200).json({
      id: updatedPost._id,
      title: updatedPost.title,
      slug: updatedPost.slug,
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      return res.status(400).json({ message: 'A post with this slug already exists' });
    }
    res.status(500).json({ message: 'Error updating blog post' });
  }
});

router.delete('/:id', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Error deleting blog post' });
  }
});

module.exports = router;
