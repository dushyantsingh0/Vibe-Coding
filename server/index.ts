import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { db } from './db/index.js';
import { posts, postVotes, comments } from './db/schema.js';
import { eq, desc, sql, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '../.env') });

console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'Yes' : 'No');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS for Vercel deployment
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);

        // Allow all origins in development
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        // In production, allow your Vercel domain and localhost
        const allowedOrigins = [
            /\.vercel\.app$/,  // Any Vercel deployment
            /^https?:\/\/localhost(:\d+)?$/,  // Localhost
        ];

        const isAllowed = allowedOrigins.some(pattern =>
            typeof pattern === 'string' ? pattern === origin : pattern.test(origin)
        );

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all for now, can restrict later
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// GET /api/posts - List all posts with vote counts and pagination
app.get('/api/posts', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // Get total count of posts
        const totalCountResult = await db.select({ count: sql<number>`count(*)` }).from(posts);
        const totalPosts = Number(totalCountResult[0]?.count || 0);
        const totalPages = Math.ceil(totalPosts / limit);

        const allPosts = await db
            .select()
            .from(posts)
            .orderBy(desc(posts.createdAt))
            .limit(limit)
            .offset(offset);

        // Get vote counts and comments count for each post
        const postsWithCounts = await Promise.all(
            allPosts.map(async (post) => {
                const commentsCount = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(comments)
                    .where(eq(comments.postId, post.id));

                return {
                    ...post,
                    comments: [],
                    commentsCount: Number(commentsCount[0]?.count || 0),
                };
            })
        );

        res.json({
            posts: postsWithCounts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// GET /api/posts/:id - Get single post with comments
app.get('/api/posts/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        const [post] = await db
            .select()
            .from(posts)
            .where(eq(posts.id, postId));

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const postComments = await db
            .select()
            .from(comments)
            .where(eq(comments.postId, postId))
            .orderBy(desc(comments.createdAt));

        // Get user's vote if userId is provided
        const userId = req.query.userId as string;
        let likedBy: string[] = [];
        let dislikedBy: string[] = [];

        if (userId) {
            const votes = await db
                .select()
                .from(postVotes)
                .where(eq(postVotes.postId, postId));

            likedBy = votes.filter(v => v.voteType === 'like').map(v => v.userId);
            dislikedBy = votes.filter(v => v.voteType === 'dislike').map(v => v.userId);
        }

        res.json({
            ...post,
            comments: postComments,
            likedBy,
            dislikedBy,
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// POST /api/posts - Create new post
app.post('/api/posts', async (req, res) => {
    try {
        const { title, excerpt, content, authorId, authorName, authorPhoto } = req.body;

        if (!title || !excerpt || !content || !authorId || !authorName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const [newPost] = await db
            .insert(posts)
            .values({
                title,
                excerpt,
                content,
                authorId,
                authorName,
                authorPhoto: authorPhoto || '',
            })
            .returning();

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// POST /api/posts/:id/vote - Like/dislike/toggle vote
app.post('/api/posts/:id/vote', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { userId, voteType } = req.body; // voteType: 'like' or 'dislike'

        if (!userId || !voteType) {
            return res.status(400).json({ error: 'Missing userId or voteType' });
        }

        // Check if user already voted
        const [existingVote] = await db
            .select()
            .from(postVotes)
            .where(and(eq(postVotes.postId, postId), eq(postVotes.userId, userId)));

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                // Remove vote (unlike/undislike)
                await db
                    .delete(postVotes)
                    .where(eq(postVotes.id, existingVote.id));

                // Update post counts
                if (voteType === 'like') {
                    await db
                        .update(posts)
                        .set({ likes: sql`${posts.likes} - 1` })
                        .where(eq(posts.id, postId));
                } else {
                    await db
                        .update(posts)
                        .set({ dislikes: sql`${posts.dislikes} - 1` })
                        .where(eq(posts.id, postId));
                }
            } else {
                // Change vote type
                await db
                    .update(postVotes)
                    .set({ voteType })
                    .where(eq(postVotes.id, existingVote.id));

                // Update post counts
                if (voteType === 'like') {
                    await db
                        .update(posts)
                        .set({
                            likes: sql`${posts.likes} + 1`,
                            dislikes: sql`${posts.dislikes} - 1`,
                        })
                        .where(eq(posts.id, postId));
                } else {
                    await db
                        .update(posts)
                        .set({
                            likes: sql`${posts.likes} - 1`,
                            dislikes: sql`${posts.dislikes} + 1`,
                        })
                        .where(eq(posts.id, postId));
                }
            }
        } else {
            // Create new vote
            await db.insert(postVotes).values({
                postId,
                userId,
                voteType,
            });

            // Update post counts
            if (voteType === 'like') {
                await db
                    .update(posts)
                    .set({ likes: sql`${posts.likes} + 1` })
                    .where(eq(posts.id, postId));
            } else {
                await db
                    .update(posts)
                    .set({ dislikes: sql`${posts.dislikes} + 1` })
                    .where(eq(posts.id, postId));
            }
        }

        // Return updated post
        const [updatedPost] = await db
            .select()
            .from(posts)
            .where(eq(posts.id, postId));

        res.json(updatedPost);
    } catch (error) {
        console.error('Error voting:', error);
        res.status(500).json({ error: 'Failed to process vote' });
    }
});

// GET /api/posts/:id/likes - Get likes/dislikes for a post
app.get('/api/posts/:id/likes', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.query.userId as string;

        const [post] = await db
            .select({ likes: posts.likes, dislikes: posts.dislikes })
            .from(posts)
            .where(eq(posts.id, postId));

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        let userLiked = false;
        let userDisliked = false;

        if (userId) {
            const [userVote] = await db
                .select()
                .from(postVotes)
                .where(and(eq(postVotes.postId, postId), eq(postVotes.userId, userId)));

            if (userVote) {
                userLiked = userVote.voteType === 'like';
                userDisliked = userVote.voteType === 'dislike';
            }
        }

        res.json({
            likes: post.likes,
            dislikes: post.dislikes,
            userLiked,
            userDisliked
        });
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ error: 'Failed to fetch likes' });
    }
});

// GET /api/posts/:id/comments - Get comments for a post
app.get('/api/posts/:id/comments', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        const postComments = await db
            .select()
            .from(comments)
            .where(eq(comments.postId, postId))
            .orderBy(desc(comments.createdAt));

        res.json({ comments: postComments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// POST /api/posts/:id/comments - Add comment
app.post('/api/posts/:id/comments', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { userId, userName, userPhoto, text } = req.body;

        if (!userId || !userName || !text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const [newComment] = await db
            .insert(comments)
            .values({
                postId,
                userId,
                userName,
                userPhoto: userPhoto || '',
                text,
            })
            .returning();

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// DELETE /api/posts/:id - Delete post
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        // Delete associated votes first
        await db.delete(postVotes).where(eq(postVotes.postId, postId));

        // Delete associated comments
        await db.delete(comments).where(eq(comments.postId, postId));

        // Delete the post
        await db.delete(posts).where(eq(posts.id, postId));

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Export app for Vercel serverless functions
export default app;

// Only start server if running locally (not in Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
