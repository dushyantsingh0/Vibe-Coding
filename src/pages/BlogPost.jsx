import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import './BlogPost.css';

export default function BlogPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updatePostLikes, addComment } = useBlog();
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const userId = currentUser?.uid || '';
            const response = await fetch(`http://localhost:3001/api/posts/${id}?userId=${userId}`);
            if (!response.ok) throw new Error('Post not found');
            const data = await response.json();

            setPost({
                id: data.id,
                title: data.title,
                date: new Date(data.createdAt).toISOString().split('T')[0],
                excerpt: data.excerpt,
                content: data.content,
                authorId: data.authorId,
                authorName: data.authorName,
                authorPhoto: data.authorPhoto,
                likes: data.likes,
                dislikes: data.dislikes,
                likedBy: data.likedBy || [],
                dislikedBy: data.dislikedBy || [],
                comments: data.comments.map(c => ({
                    id: c.id,
                    text: c.text,
                    timestamp: c.createdAt,
                    userId: c.userId,
                    userName: c.userName,
                    userPhoto: c.userPhoto
                }))
            });
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id, currentUser]);

    const handleLike = async () => {
        if (!currentUser) {
            alert('Please sign in to like posts');
            return;
        }
        await updatePostLikes(post.id, 'like', currentUser.uid);
        await fetchPost();
    };

    const handleDislike = async () => {
        if (!currentUser) {
            alert('Please sign in to dislike posts');
            return;
        }
        await updatePostLikes(post.id, 'dislike', currentUser.uid);
        await fetchPost();
    };

    const handleComment = async (commentText) => {
        if (!currentUser) {
            alert('Please sign in to comment');
            return;
        }
        await addComment(post.id, commentText, currentUser);
        await fetchPost();
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete post');
            navigate('/');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
            setShowDeleteConfirm(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    if (loading) {
        return <div className="loading">Loading post...</div>;
    }

    if (!post) {
        return (
            <div className="not-found">
                <h1>Post not found</h1>
                <Link to="/" className="back-link">← Back to home</Link>
            </div>
        );
    }

    const userLiked = currentUser && post.likedBy.includes(currentUser.uid);
    const userDisliked = currentUser && post.dislikedBy.includes(currentUser.uid);
    const isAuthor = currentUser && currentUser.uid === post.authorId;

    return (
        <article className="blog-post">
            <Link to="/" className="back-link">← Back to all posts</Link>

            <header className="post-header">
                <time className="post-date">{new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</time>
                <h1 className="post-title">{post.title}</h1>
                <div className="post-author-info">
                    <img src={post.authorPhoto} alt={post.authorName} className="post-author-avatar" />
                    <span className="post-author-name">{post.authorName}</span>
                </div>
            </header>

            <div className="post-content">
                {post.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>

            <div className="post-actions">
                <div className="like-dislike">
                    <button
                        onClick={handleLike}
                        className={`action-btn like-btn ${userLiked ? 'active' : ''}`}
                        title={userLiked ? 'Unlike' : 'Like'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={userLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        <span>{post.likes}</span>
                    </button>
                    <button
                        onClick={handleDislike}
                        className={`action-btn dislike-btn ${userDisliked ? 'active' : ''}`}
                        title={userDisliked ? 'Remove dislike' : 'Dislike'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={userDisliked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                        </svg>
                        <span>{post.dislikes}</span>
                    </button>
                </div>

                {isAuthor && (
                    <button type="button" onClick={handleDeleteClick} className="delete-btn">
                        Delete Post
                    </button>
                )}
            </div>

            {showDeleteConfirm && (
                <div className="delete-modal">
                    <div className="delete-modal-content">
                        <h3>Delete Post?</h3>
                        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="delete-modal-actions">
                            <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
                            <button onClick={confirmDelete} className="confirm-delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="comments-section">
                <h2 className="comments-title">Comments ({post.comments.length})</h2>
                {currentUser ? (
                    <CommentForm onSubmit={handleComment} />
                ) : (
                    <div className="login-to-comment">
                        <p>Please <Link to="/login">sign in</Link> to comment</p>
                    </div>
                )}
                <CommentList comments={post.comments} />
            </div>
        </article>
    );
}
