import { Link } from 'react-router-dom';
import './PostCard.css';

export default function PostCard({ post }) {
    return (
        <Link to={`/post/${post.id}`} className="post-card">
            <time className="post-date">{new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</time>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-excerpt">{post.excerpt}</p>
            <div className="post-meta">
                <div className="post-author">
                    <img src={post.authorPhoto} alt={post.authorName} className="author-avatar" />
                    <span className="author-name">{post.authorName}</span>
                </div>
                <div className="post-stats">
                    <span className="stat-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        {post.likes || 0}
                    </span>
                    <span className="stat-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                        </svg>
                        {post.dislikes || 0}
                    </span>
                    <span className="stat-item">
                        💬 {post.commentsCount || 0}
                    </span>
                </div>
            </div>
        </Link>
    );
}
