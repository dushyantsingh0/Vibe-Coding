import { createContext, useContext, useState, useEffect } from 'react';

const BlogContext = createContext();
// Use environment variable in development, relative path in production
const API_URL = import.meta.env.VITE_API_URL || '/api';

export function BlogProvider({ children }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all posts on mount
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/posts`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();

            // Transform API data to match frontend format
            const transformedPosts = data.map(post => ({
                id: post.id,
                title: post.title,
                date: new Date(post.createdAt).toISOString().split('T')[0],
                excerpt: post.excerpt,
                content: post.content,
                authorId: post.authorId,
                authorName: post.authorName,
                authorPhoto: post.authorPhoto,
                likes: post.likes,
                dislikes: post.dislikes,
                likedBy: [],
                dislikedBy: [],
                comments: post.comments || []
            }));

            setPosts(transformedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const addPost = async (post, user) => {
        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: post.title,
                    excerpt: post.excerpt,
                    content: post.content,
                    authorId: user.uid,
                    authorName: user.displayName,
                    authorPhoto: user.photoURL
                })
            });

            if (!response.ok) throw new Error('Failed to create post');
            const newPost = await response.json();

            // Refresh posts list
            await fetchPosts();
            return newPost.id;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    };

    const updatePostLikes = async (postId, action, userId) => {
        try {
            const response = await fetch(`${API_URL}/posts/${postId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    voteType: action // 'like' or 'dislike'
                })
            });

            if (!response.ok) throw new Error('Failed to update vote');
            const updatedPost = await response.json();

            // Update local state
            setPosts(posts.map(post =>
                post.id === postId
                    ? { ...post, likes: updatedPost.likes, dislikes: updatedPost.dislikes }
                    : post
            ));
        } catch (error) {
            console.error('Error updating vote:', error);
            throw error;
        }
    };

    const addComment = async (postId, commentText, user) => {
        try {
            const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    userName: user.displayName,
                    userPhoto: user.photoURL,
                    text: commentText
                })
            });

            if (!response.ok) throw new Error('Failed to add comment');
            const newComment = await response.json();

            // Update local state
            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: [
                            ...post.comments,
                            {
                                id: newComment.id,
                                text: newComment.text,
                                timestamp: newComment.createdAt,
                                userId: newComment.userId,
                                userName: newComment.userName,
                                userPhoto: newComment.userPhoto
                            }
                        ]
                    };
                }
                return post;
            }));
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    const value = {
        posts,
        loading,
        addPost,
        updatePostLikes,
        addComment,
        refreshPosts: fetchPosts
    };

    return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within BlogProvider');
    }
    return context;
}
