import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import SkeletonLoader from './SkeletonLoader';
import './PostComments.css';

export default function PostComments({ postId, currentUser }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${API_URL}/posts/${postId}/comments`);

            if (!response.ok) throw new Error('Failed to fetch comments');

            const data = await response.json();
            setComments(data.comments.map(c => ({
                id: c.id,
                text: c.text,
                timestamp: c.createdAt,
                userId: c.userId,
                userName: c.userName,
                userPhoto: c.userPhoto
            })));
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    const handleAddComment = async (commentText) => {
        if (!currentUser) {
            alert('Please sign in to comment');
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: commentText,
                    userId: currentUser.uid,
                    userName: currentUser.displayName || 'Anonymous',
                    userPhoto: currentUser.photoURL || 'https://via.placeholder.com/40'
                })
            });

            if (!response.ok) throw new Error('Failed to add comment');

            await fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error; // Re-throw so CommentForm can handle it
        }
    };

    return (
        <div className="post-comments-section">
            <h2 className="comments-title">Comments ({loading ? '...' : comments.length})</h2>

            {currentUser ? (
                <CommentForm onSubmit={handleAddComment} />
            ) : (
                <div className="login-to-comment">
                    <p>Please <Link to="/login">sign in</Link> to comment</p>
                </div>
            )}

            {loading ? (
                <div className="comments-skeleton">
                    <SkeletonLoader type="comment" />
                    <SkeletonLoader type="comment" />
                    <SkeletonLoader type="comment" />
                </div>
            ) : (
                <CommentList comments={comments} />
            )}
        </div>
    );
}
