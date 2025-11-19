import { useState } from 'react';
import './CommentForm.css';

export default function CommentForm({ onSubmit }) {
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            onSubmit(comment);
            setComment('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="comment-input"
                rows="3"
            />
            <button type="submit" className="comment-submit">
                Post Comment
            </button>
        </form>
    );
}
