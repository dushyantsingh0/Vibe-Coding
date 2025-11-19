import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SkeletonLoader from './SkeletonLoader';
import './PostLikes.css';

export default function PostLikes({ postId, currentUser }) {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState(false);
    const [dislikeLoading, setDislikeLoading] = useState(false);

    const fetchLikes = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const userId = currentUser?.uid || '';
            const response = await fetch(`${API_URL}/posts/${postId}/likes?userId=${userId}`);

            if (!response.ok) throw new Error('Failed to fetch likes');

            const data = await response.json();
            setLikes(data.likes);
            setDislikes(data.dislikes);
            setUserLiked(data.userLiked || false);
            setUserDisliked(data.userDisliked || false);
        } catch (error) {
            console.error('Error fetching likes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchLikes();
        }
    }, [postId, currentUser]);

    const handleLike = async () => {
        if (!currentUser) {
            alert('Please sign in to like posts');
            return;
        }

        // Optimistic update
        const wasLiked = userLiked;
        const wasDisliked = userDisliked;

        setLikes(prev => wasLiked ? prev - 1 : prev + (wasDisliked ? 2 : 1));
        setDislikes(prev => wasDisliked ? prev - 1 : prev);
        setUserLiked(!wasLiked);
        setUserDisliked(false);

        setLikeLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${API_URL}/posts/${postId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.uid,
                    voteType: 'like'
                })
            });

            if (!response.ok) throw new Error('Failed to update like');
            await fetchLikes(); // Sync with server
        } catch (error) {
            console.error('Error updating like:', error);
            await fetchLikes(); // Revert on error
        } finally {
            setLikeLoading(false);
        }
    };

    const handleDislike = async () => {
        if (!currentUser) {
            alert('Please sign in to dislike posts');
            return;
        }

        // Optimistic update
        const wasLiked = userLiked;
        const wasDisliked = userDisliked;

        setLikes(prev => wasLiked ? prev - 1 : prev);
        setDislikes(prev => wasDisliked ? prev - 1 : prev + (wasLiked ? 2 : 1));
        setUserLiked(false);
        setUserDisliked(!wasDisliked);

        setDislikeLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${API_URL}/posts/${postId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.uid,
                    voteType: 'dislike'
                })
            });

            if (!response.ok) throw new Error('Failed to update dislike');
            await fetchLikes(); // Sync with server
        } catch (error) {
            console.error('Error updating dislike:', error);
            await fetchLikes(); // Revert on error
        } finally {
            setDislikeLoading(false);
        }
    };

    if (loading) {
        return <SkeletonLoader type="likes" />;
    }

    return (
        <div className="post-likes">
            <div className="like-dislike">
                <button
                    onClick={handleLike}
                    className={`action-btn like-btn btn-ripple ${userLiked ? 'active' : ''}`}
                    title={userLiked ? 'Unlike' : 'Like'}
                    disabled={likeLoading || dislikeLoading}
                >
                    {likeLoading ? (
                        <LoadingSpinner size="small" color="white" />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={userLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                    )}
                    <span className="count-animate">{likes}</span>
                </button>
                <button
                    onClick={handleDislike}
                    className={`action-btn dislike-btn btn-ripple ${userDisliked ? 'active' : ''}`}
                    title={userDisliked ? 'Remove dislike' : 'Dislike'}
                    disabled={likeLoading || dislikeLoading}
                >
                    {dislikeLoading ? (
                        <LoadingSpinner size="small" color="white" />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={userDisliked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                        </svg>
                    )}
                    <span className="count-animate">{dislikes}</span>
                </button>
            </div>
        </div>
    );
}
