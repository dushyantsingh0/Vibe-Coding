import './CommentList.css';

export default function CommentList({ comments }) {
    if (comments.length === 0) {
        return (
            <div className="no-comments">
                <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="comment-list">
            {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                        {comment.userPhoto && (
                            <img src={comment.userPhoto} alt={comment.userName} className="comment-avatar" />
                        )}
                        <div className="comment-meta">
                            <span className="comment-author">{comment.userName || 'Anonymous'}</span>
                            <time className="comment-time">
                                {new Date(comment.timestamp).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </time>
                        </div>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                </div>
            ))}
        </div>
    );
}
