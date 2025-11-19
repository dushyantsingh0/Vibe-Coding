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
                <span>💬 {post.comments?.length || 0} comments</span>
            </div>
        </Link>
    );
}
