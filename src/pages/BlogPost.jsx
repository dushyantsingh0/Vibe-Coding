import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostLikes from '../components/PostLikes';
import PostComments from '../components/PostComments';
import './BlogPost.css';

export default function BlogPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${API_URL}/posts/${id}`);

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
                authorPhoto: data.authorPhoto
            });
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${API_URL}/posts/${post.id}`, {
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

            {/* Independent Likes Component */}
            <PostLikes postId={id} currentUser={currentUser} />

            {/* Delete button for author */}
            {isAuthor && (
                <div className="post-actions">
                    <button type="button" onClick={handleDeleteClick} className="delete-btn">
                        Delete Post
                    </button>
                </div>
            )}

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

            {/* Independent Comments Component */}
            <PostComments postId={id} currentUser={currentUser} />
        </article>
    );
}
