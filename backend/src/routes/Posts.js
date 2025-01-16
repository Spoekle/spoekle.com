const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js');
const bcrypt = require('bcrypt');
const ffmpeg = require('fluent-ffmpeg');

const Post = require('../models/postModel');
const IpVote = require('../models/ipVoteModel');
const authorizeRoles = require('./middleware/AuthorizeRoles');
const searchLimiter = require('./middleware/SearchLimiter');
const postUpload = require('./storage/PostUpload');

/**
 * @swagger
 * tags:
 *   name: posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags:
 *       - posts
 *     summary: Get all posts
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/posts/search:
 *   get:
 *     tags:
 *       - posts
 *     summary: Search posts
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Missing parameter
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/search', searchLimiter, async (req, res) => {
    let { q, page = 1, limit = 10 } = req.query;

    if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'Missing search query parameter `q`.' });
    }

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    try {
        const allPosts = await Post.find().sort({ createdAt: -1 });

        const options = {
            keys: ['title', 'streamer', 'submitter'],
            threshold: 0.3,
        };
        const fuse = new Fuse(allPosts, options);

        const results = fuse.search(q);
        const posts = results.slice(skip, skip + limit).map(result => result.item);

        if (posts.length === 0) {
            return res.status(404).json({ message: `No posts found matching "${q}".` });
        }

        const totalPosts = results.length;

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
        });
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     tags:
 *       - posts
 *     summary: Get a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', authorizeRoles(['uploader', 'admin']), postUpload.single('post'), async (req, res) => {
    console.log("=== Handling new post upload ===");
    try {
        const { streamer, submitter, title, url, link } = req.body;
        console.log("Request body:", { streamer, submitter, title, url, link });

        let fileUrl;
        let thumbnailUrl;
        if (url) {
            fileUrl = url;
            thumbnailUrl = null;
            console.log("Using provided URL:", fileUrl);
        } else if (req.file) {
            fileUrl = `https://api.spoekle.com/uploads/${req.file.filename}`;
            console.log("File uploaded with filename:", req.file.filename);

            // Generate thumbnail
            const thumbnailFilename = `${path.parse(req.file.filename).name}_thumbnail.png`;
            console.log("Generating thumbnail:", thumbnailFilename);

            const uploadPath = path.join(__dirname, '..', 'uploads', req.file.filename);
            await new Promise((resolve, reject) => {
                ffmpeg(uploadPath)
                    .screenshots({
                        timestamps: ['00:00:00.001'],
                        filename: thumbnailFilename,
                        folder: path.join(__dirname, '..', 'uploads'),
                        size: '640x360',
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            thumbnailUrl = `https://api.spoekle.com/uploads/${thumbnailFilename}`;
            console.log("Thumbnail URL:", thumbnailUrl);
        } else {
            console.log("No file or link provided.");
            return res.status(400).json({ error: 'No file or link provided' });
        }

        const newPost = new Post({ url: fileUrl, thumbnail: thumbnailUrl, streamer, submitter, title, link });
        await newPost.save();

        console.log("New post saved:", newPost);
        res.json({ success: true, post: newPost });
    } catch (error) {
        console.error("Error processing post upload:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', authorizeRoles(['uploader', 'admin']), async (req, res) => {
    const { id } = req.params;
    const { streamer, submitter, title } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (streamer !== undefined) {
            post.streamer = streamer;
        }

        if (submitter !== undefined) {
            post.submitter = submitter;
        }

        if (title !== undefined) {
            post.title = title;
        }

        await post.save();

        res.json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', authorizeRoles(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (post) {
            try {
                fs.unlinkSync(path.join(__dirname, 'uploads', path.basename(post.url)));
            } catch (error) {
                console.error("Error removing file:", error.message);
            }
            await post.remove();
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/', authorizeRoles(['admin']), async (req, res) => {
    try {
        await Post.deleteMany({});
        const files = fs.readdirSync(path.join(__dirname, 'uploads'));
        for (const file of files) {
            fs.unlinkSync(path.join(__dirname, 'uploads', file));
        }
        res.json({ success: true, message: 'All posts deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:id/vote/:voteType', async (req, res) => {
    try {
        const clientIp = req.ip;
        const { id, voteType } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        const existingVotes = await IpVote.find({ postId: id });

        for (const vote of existingVotes) {
            if (await bcrypt.compare(clientIp, vote.ip)) {
                if (vote.vote === voteType) {
                    // Same vote => remove vote
                    if (voteType === 'upvote') {
                        post.upvotes -= 1;
                    } else {
                        post.downvotes -= 1;
                    }
                    await vote.remove();
                    await post.save();
                    return res.send(post);
                } else {
                    // Switching vote
                    if (voteType === 'upvote') {
                        post.upvotes += 1;
                        post.downvotes -= 1;
                    } else {
                        post.downvotes += 1;
                        post.upvotes -= 1;
                    }
                    vote.vote = voteType;
                    await vote.save();
                    await post.save();
                    return res.send(post);
                }
            }
        }

        const hashedIp = await bcrypt.hash(clientIp, 10);
        if (voteType === 'upvote') {
            post.upvotes += 1;
        } else {
            post.downvotes += 1;
        }
        const newVote = new IpVote({ postId: id, ip: hashedIp, vote: voteType });
        await newVote.save();
        await post.save();
        res.send(post);
    } catch (error) {
        console.error('Error voting post:', error.message);
        res.status(500).send('Internal server error');
    }
});

//Comment on post
router.post('/:id/comment', authorizeRoles(['user', 'editor', 'uploader', 'admin']), async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const username = req.user.username;

    if (!comment) {
        return res.status(400).json({ error: 'Comment is required' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.comments.push({ username, comment });
        await post.save();

        res.json(post);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a comment from a post
router.delete('/:postId/comment/:commentId', authorizeRoles(['user', 'editor', 'uploader', 'admin']), async (req, res) => {
    const { postId, commentId } = req.params;
    const username = req.user.username;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.username == username || req.user.roles.includes('admin')) {
            comment.remove();
            await post.save();
            return res.json(post);
        } else {
            return res.status(403).json({ error: 'Forbidden: You do not have the required permissions' });
        }

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;